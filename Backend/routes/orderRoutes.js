import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/all", protect, isAdmin, getAllOrders); // admin
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, isAdmin, updateOrderStatus); // admin

export default router;
