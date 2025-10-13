const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

router.get('/', async (req, res) => {
    const listOdPosts = await User.findAll();
    res.json(listOfUsers);
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id, {
        include: [{ model: Post, as: 'posts' }],
    });
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

router.post('/create', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const newUser = await User.create({ firstName, lastName, email, password });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});