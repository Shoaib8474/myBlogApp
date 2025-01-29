const express = require('express');
const router = express.Router();
const { Profile, User } = require('../models');


// Display Single User
router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, { include: Profile });
    res.render('users/show', { user });
});

// Show Edit Form
router.get('/:id/edit', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.render('users/edit', { user });
});

module.exports = router;

