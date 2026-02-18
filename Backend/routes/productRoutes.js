import express from "express";
import {
  addProduct,
  getAllProducts,
  getSingleProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", addProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

export default router;
