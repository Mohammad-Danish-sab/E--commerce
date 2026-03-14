import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getUserCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getUserCart);
router.post("/", protect, addToCart);
router.delete("/:itemId", protect, removeFromCart);
router.delete("/", protect, clearCart);
router.put("/:itemId", protect, updateCartItem);

export default router;
