import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getUserOrders,
  getSingleOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getSingleOrder);


export default router;
