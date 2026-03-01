import express from "express";
import upload from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// router.post("/", upload.single("image"), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", protect, isAdmin, upload.single("image"), addProduct);
router.put("/:id", protect, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);


// router.put("/:id", upload.single("image"), updateProduct);
// router.delete("/:id", deleteProduct);

export default router;
