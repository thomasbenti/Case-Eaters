import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  flagPost,
  expirePost,
  getPostsByUser,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes (require authentication)
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/flag", protect, flagPost);
router.put("/:id/expire", protect, expirePost);
router.get("/user/:userId", protect, getPostsByUser);

export default router;