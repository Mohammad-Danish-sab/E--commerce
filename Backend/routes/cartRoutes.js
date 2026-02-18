import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addToCart,
  getUserCart,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getUserCart);
router.delete("/:itemId", protect, removeFromCart);

export default router;
