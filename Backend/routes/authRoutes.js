import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  getAllUsers,
  changePassword,
  addAddress,
  deleteAddress,
} from "../controllers/authController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/change-password", protect, changePassword);
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:index", protect, deleteAddress);
router.get("/users", protect, isAdmin, getAllUsers); // admin only

export default router;
