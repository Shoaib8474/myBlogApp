const express = require('express');
const router = express.Router();
const { User, Profile, Like } = require('../models');
const profileControllers = require('../controllers/ProfileController')
const { authenticateToken } = require('../middlewares/authMiddleware')

router.use(authenticateToken);


// View Profile for a specific user
router.get('/:userId', profileControllers.getProfile);
// Render Edit Profile form
router.get('/:userId/edit', profileControllers.getEditProfile );
// Update Profile
router.post('/:userId/edit', profileControllers.postEditProfile);
// Handle Article Deletion
router.post('/:id/delete', profileControllers.deleteProfile);
router.get('/liked/:userId', profileControllers.articleLiked)

module.exports = router;