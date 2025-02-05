const express = require('express');
const router = express.Router();
const { User, Profile, Like } = require('../models');
const profileControllers = require('../controllers/ProfileController')
const { authenticateToken } = require('../middlewares/authMiddleware')
const multer = require('../middlewares/multerMiddleware')


router.use(authenticateToken);

// View Profile for a specific user
router.get('/:userId', profileControllers.getProfile);
router.post('/:id/delete', profileControllers.deleteProfile);
// Render Edit Profile form
router.get('/:userId/edit', profileControllers.getEditProfile );
// Update Profile
router.post('/:userId/edit', multer.single('images'), profileControllers.postEditProfile);
// Handle Article Deletion
router.get('/liked/:userId', profileControllers.articleLiked)

module.exports = router;