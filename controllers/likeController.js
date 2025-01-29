const express = require("express");
const router = express.Router();
const { Op } = require('sequelize');
const {
  sequelize,
  Article,
  User,
  Like,
  Profile
} = require("../models");
const { authenticateToken } = require("../middlewares/authMiddleware");


const likeControllers = {
    unlikeArticle: async (req, res) => {
        try {
          const userId = req.user.id; 
          const articleId = req.params.id;
      
          // Check if the article exists
          const article = await Article.findByPk(articleId);
          if (!article) {
            return res.status(404).send("Article not found");
          }
      
          // Check if the user has liked the article
          const like = await Like.findOne({ where: { userId, articleId } });
          if (!like) {
            return res.status(404).send("You have not liked this article");
          }
      
          // Remove the like
          await like.destroy();
      
          return res.redirect(`/articles/${articleId}`); 
        } catch (error) {
          console.error(error);
          res.status(500).send("Server error");
        }
      }, 

    likeArticle: async (req, res) => {
        try {
          const userId = req.user.id; 
          const articleId = req.params.id;
      
          // Check if the article exists
          const article = await Article.findByPk(articleId);
          if (!article) {
            return res.status(404).send("Article not found");
          }
      
          // Check if the user has already liked the article
          const existingLike = await Like.findOne({ where: { userId, articleId } });
          if (existingLike) {
            return res.status(409).send("You have already liked this article");
          }
      
          // Add a like
          await Like.create({ userId, articleId });
      
          return res.redirect(`/articles/${articleId}`); 
        } catch (error) {
          console.error(error);
          res.status(500).send("Server error");
        }
      }
}



module.exports = likeControllers;
  