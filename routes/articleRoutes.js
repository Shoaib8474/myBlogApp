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
// Route to like an article



// // Display Single Article
// router.get('/:id', async (req, res) => {
//     const article = await Article.findByPk(req.params.id, { include: User });
//     const user = await User.findByPk(req.params.id, { include: Profile });
//     res.render('articles/show', { article, user });
//     // res.json({article})
// });

// Route to get an article
// Controller to fetch and render an article with likes
// router.get('/:id', async (req, res) => {
//     try {
//         const articleId = req.params.id;

//         // Find the article along with its like count
//         const article = await Article.findByPk(articleId, {
//             include: [
//                 {
//                     model: Like,
//                     attributes: []
//                 },
//             ],
//             attributes: {
//                 include: [
//                     [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'likeCount'],
//                 ],
//             },
//             group: ['Article.id'],
//         });

//         if (!article) {
//             return res.status(404).send('Article not found');
//         }
//          console.log("Forenkeyis", article.userId)
//         // Check if the current user has liked this article
//         const userId =  article.userId  //req.user ? req.user.id : null; // Ensure req.user exists for unauthenticated users
//         const hasLiked = (await Like.findOne({ where: { userId, articleId } })) ? userId : false;

//         res.render('articles', { article, hasLiked });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// }
// );
// // Display All Articles
// router.get("/", async (req, res) => {
//   const articles = await Article.findAll({ include: User });
//   res.render("articles/index", { articles });
// });

// // Display Single Article
// router.get("/:id", async (req, res) => {
//   try {
//     const articleId = req.params.id;
//     const user = await User.findByPk(req.params.id, { include: Profile });

//     // Find the article along with its like count
//     const article = await Article.findByPk(articleId, {
//       include: [
//         {
//           model: Like,
//           // attributes: ["id"],
//         },
//         {
//           model: User,
//           attributes: ["id", "username", "email"],
//         },
//       ],
//       attributes: {
//         include: [
//           [sequelize.fn("COUNT", sequelize.col("Likes.id")), "likeCount"],
//         ],
//       },
//       group: ["Article.id", "Likes.id"],
//     });
//       //  res.json({article})
//     if (!article) {
//       return res.status(404).send("Article not found");
//     }

//     // Check if the current user has liked this article
//     const userId = req.user ? req.user.id : null;
//     const authorisedUser = userId === article.userId ? true : false; // Ensure req.user exists for unauthenticated users
//     console.log("Authenticated UserId: ", authorisedUser);
//     const hasLiked =
//       (await Like.findOne({ where: { userId, articleId } })) || false;
//       // console.log(hasLiked)
//       // console.log(article.User.id)
//       const hasFollow =
//         (await Follow.findOne({ where: { followingId: userId, followerId: article.userId  } })) || false;
//         const authorisedFollowedUser = userId === article.userId ? true : false;
//     // const usersList = await User.findAll({ where: { id: { [Op.ne]: userId } } }); // Exclude current user
//     // const following = await Follow.findAll({ where: { followerId: userId } });
//     // const followingIds = following.map((follow) => follow.followingId);
//     res.render("articles/show", { article, hasLiked, user, authorisedUser, authorisedFollowedUser, hasFollow });
//   } catch (error) {
//     res.status(404).json({ error: "Cant Find any Info." });
//   }
// });

// // Show Edit article
// router.get("/:id/edit", async (req, res) => {
//   const article = await Article.findByPk(req.params.id);
//   const users = await User.findAll();
//   res.render("articles/edit", { article, users });
// });

// // Handle Article Update
// router.post("/:id/edit", async (req, res) => {
//   const { title, content, category } = req.body;
//   await Article.update(
//     { title, content, category },
//     { where: { id: req.params.id } }
//   );
//   res.redirect(`/articles/${req.params.id}`);
// });

// // // Handle Article Deletion
// // router.post('/:id/delete', async (req, res) => {
// //     await Article.destroy({ where: { id: req.params.id } });
// //     res.redirect('/articles');
// // });

// // like feature implement
// // Route to like an article
// router.post("/:id/like", async (req, res) => {
//   try {
//     const userId = req.user.id; // Assume the user is authenticated, and `req.user` has the logged-in user's info
//     const articleId = req.params.id;

//     // Check if the article exists
//     const article = await Article.findByPk(articleId);
//     if (!article) {
//       return res.status(404).send("Article not found");
//     }

//     // Check if the user has already liked the article
//     const existingLike = await Like.findOne({ where: { userId, articleId } });
//     if (existingLike) {
//       return res.status(409).send("You have already liked this article");
//     }

//     // Add a like
//     await Like.create({ userId, articleId });

//     return res.redirect(`/articles/${articleId}`); // Redirect to the article page
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // Route to unlike an article
// router.post("/:id/unlike", async (req, res) => {
//   try {
//     const userId = req.user.id; // Assume the user is authenticated
//     const articleId = req.params.id;

//     // Check if the article exists
//     const article = await Article.findByPk(articleId);
//     if (!article) {
//       return res.status(404).send("Article not found");
//     }

//     // Check if the user has liked the article
//     const like = await Like.findOne({ where: { userId, articleId } });
//     if (!like) {
//       return res.status(404).send("You have not liked this article");
//     }

//     // Remove the like
//     await like.destroy();

//     return res.redirect(`/articles/${articleId}`); // Redirect to the article page
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // // Display Single Article
// // router.get('/:id', async (req, res) => {
// //     const article = await Article.findByPk(req.params.id, { include: User });
// //     const user = await User.findByPk(req.params.id, { include: Profile });
// //     res.render('articles/show', { article, user });
// //     // res.json({article})
// // });

// // Route to get an article
// // Controller to fetch and render an article with likes
// // router.get('/:id', async (req, res) => {
// //     try {
// //         const articleId = req.params.id;

// //         // Find the article along with its like count
// //         const article = await Article.findByPk(articleId, {
// //             include: [
// //                 {
// //                     model: Like,
// //                     attributes: []
// //                 },
// //             ],
// //             attributes: {
// //                 include: [
// //                     [sequelize.fn('COUNT', sequelize.col('Likes.id')), 'likeCount'],
// //                 ],
// //             },
// //             group: ['Article.id'],
// //         });

// //         if (!article) {
// //             return res.status(404).send('Article not found');
// //         }
// //          console.log("Forenkeyis", article.userId)
// //         // Check if the current user has liked this article
// //         const userId =  article.userId  //req.user ? req.user.id : null; // Ensure req.user exists for unauthenticated users
// //         const hasLiked = (await Like.findOne({ where: { userId, articleId } })) ? userId : false;

// //         res.render('articles', { article, hasLiked });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).send('Server error');
// //     }
// // }
// // );

module.exports = router;
