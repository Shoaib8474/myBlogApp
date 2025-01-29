const express = require("express");
const router = express.Router();
const { Op } = require('sequelize');

const {
  sequelize,
  Article,
  User,
  Like,
  Profile,
  Follow,
} = require("../models");
const { authenticateToken } = require("../middlewares/authMiddleware");
const articleController = require('../controllers/articleController')
const likeControllers = require('../controllers/likeController')

router.use(authenticateToken); //auth

router.get("/create", articleController.renderCreateArticle)
router.post("/create", articleController.createArticle)
// Display All Articles
router.get("/", articleController.getArticles);
// Display Single Article
router.get("/:id", articleController.getSingleArticle);
// Show Edit article
router.get("/:id/edit", articleController.getEditArticle);
// Handle Article Update
router.post("/:id/edit", articleController.postEditArticle);

// Handle Article Deletion
router.post('/:id/delete', async (req, res) => {
    await Article.destroy({ where: { id: req.params.id } });
    res.redirect('/articles');
});

// like/unlike routes
router.post("/:id/like", likeControllers.likeArticle);
router.post("/:id/unlike", likeControllers.unlikeArticle);

module.exports = router;
