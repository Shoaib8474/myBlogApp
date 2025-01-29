const express = require('express');
const router = express.Router();
const { sequelize, Article, User, Follow, Like, Profile } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken } = require("../middlewares/authMiddleware");

router.use(authenticateToken);


// Follow a user
router.post('/:id', async (req, res) => {
    try {
        console.log("MMM", req.user)
        const followerId =  req.user.id; 
        const followingId = req.params.id;

        // Check if the follow relationship already exists
        const existingFollow = await Follow.findOne({ where: { followerId, followingId } });

        if (!existingFollow) {
            await Follow.create({ followerId, followingId });
        }

        res.redirect('back'); // redirect to the same page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Unfollow a user
router.post('/unfollow/:id', async (req, res) => {
    try {
        const followerId = req.user.id; 
        const followingId = req.params.id;

        await Follow.destroy({ where: { followerId, followingId } });

        res.redirect('back'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



module.exports = router;

