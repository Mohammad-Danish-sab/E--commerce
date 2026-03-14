import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

import {
  createOrder,
  getAllOrders,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, isAdmin, getAllOrders);
router.get("/:id", protect, getOrderById);

export default router;
