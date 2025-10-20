const { Post, User } = require('../models');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }],
        });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, description, location, time, experationTime, repOrSwipe } = req.body;

        // example reporter ID
        const reporterId = 1; 

        const newPost = await Post.create({
            title,
            description,
            location,
            time,
            experationTime,
            repOrSwipe,
            reporter: reporterId,
        });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
