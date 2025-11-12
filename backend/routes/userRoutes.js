import express from "express";
import {
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected (require authentication)

// User profile management
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserAccount);

// Get users
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);

export default router;