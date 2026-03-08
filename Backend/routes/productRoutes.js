import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import Product from "../models/Product.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Admin only routes
router.post("/", protect, isAdmin, upload.single("image"), addProduct);
router.put("/:id", protect, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

// Reviews — any logged in user
router.post("/:id/reviews", protect, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment)
    return res.status(400).json({ message: "Rating and comment required." });
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    const alreadyReviewed = product.reviews?.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );
    if (alreadyReviewed)
      return res
        .status(400)
        .json({ message: "You already reviewed this product." });
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
    product.avgRating =
      product.reviews.reduce((s, r) => s + r.rating, 0) /
      product.reviews.length;
    product.numReviews = product.reviews.length;
    await product.save();
    res
      .status(201)
      .json({ message: "Review added.", reviews: product.reviews });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

export default router;
