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
const { Post, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Gets all posts
router.get('/', async (req, res) => {
    try{
        const listOfPosts = await Post.findAll({
            include: [{model: User, as: 'user', attributes: ['firstName', 'lastName', 'email']}]
    });
    res.json(listOfPosts);
    } catch (err){
        res.status(500).json({error: err.message});
    }
});

// Get posts by a user
router.get('/byUser/:userId', async (req, res) => {
    const id = req.params.userId;
    try{
        const user = await User.findByPk(id, {
        include: [{ model: Post, as: 'posts' }],
    });
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Creates a new post
router.post('/create', authMiddleware, async (req, res) => {
    
    try {
        if(!req.user){
            return res.status(401).json({error: 'Unauthorized'});
        }
        const { title, description, location, time, experationTime, repOrSwipe } = req.body;
        const newPost = await Post.create({
            title,
            description,
            location,
            time,
            experationTime,
            repOrSwipe,
            reporter: req.user.id,
        });
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;