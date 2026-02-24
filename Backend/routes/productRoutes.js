import express from "express";
import upload from "../middleware/upload.js";

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", upload.single("image"), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
// router.post("/", isAdmin, upload.single("image"), addProduct);
// router.put("/:id", isAdmin, upload.single("image"), updateProduct);
// router.delete("/:id", isAdmin, deleteProduct);

// ⭐ NEW
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
