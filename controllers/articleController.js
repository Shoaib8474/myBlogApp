const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const { sequelize, Article, User, Like, Profile, File } = require("../models");
const { authenticateToken } = require("../middlewares/authMiddleware");

const articleControllers = {
  getArticles: async (req, res) => {
    const articles = await Article.findAll({
      include: User,
    });
    res.render("articles/index", {
      articles,
    });
  },

  getSingleArticle: async (req, res) => {
    try {
      const articleId = req.params.id;
      const user = await User.findByPk(req.params.id, {
        include: Profile,
      });

      // Find the article along with its like count
      const article = await Article.findByPk(articleId, {
        include: [
          {
            model: Like,
            // attributes: ["id"],
          },
          {
            model: User,
            attributes: ["id", "username", "email"],
          },
          {
            model: File,
          },
        ],
        attributes: {
          include: [
            [sequelize.fn("COUNT", sequelize.col("Likes.id")), "likeCount"],
          ],
        },
        group: ["Article.id", "User.id", "Likes.id", "Files.id"],
      });
      //  res.json({article})
      if (!article) {
        return res.status(404).send("Article not found");
      }

      // Check if the current user has liked this article
      const userId = req.user ? req.user.id : null;
      const authorisedUser = userId === article.userId ? true : false;
      console.log("Authenticated UserId: ", authorisedUser);
      const hasLiked =
        (await Like.findOne({
          where: {
            userId,
            articleId,
          },
        })) || false;

      res.render("articles/show", {
        article,
        hasLiked,
        user,
        authorisedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: "Cant Find any Info.",
      });
    }
  },

  getEditArticle: async (req, res) => {
    const article = await Article.findByPk(req.params.id, {
      include: File,
    });
    const users = await User.findAll();
    res.render("articles/edit", {
      article,
      users,
    });
  },

  picEditArticle: async (req, res) => {
    const { title, content, category } = req.body;
    const article = await Article.findByPk(req.params.id, {
      include: File,
    });
    await Article.update(
      {
        title,
        content,
        category,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    const users = await User.findAll();

    // Delete existing image
    if (article.Files.length > 0) {
      for (let file of article.Files) {
        const filePath = path.join(__dirname, "..", file.path);

        // Delete file from filesystem
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Delete file record
        await file.destroy();
      }
    }

    // // Save new uploaded images
    // console.log("MMMM", req.files);
    // if (req.files) {
    //   const filePromises = req.files.map((file) => {
    //     return File.create({
    //       filename: file.originalname,
    //       path: file.path,
    //       mimetype: file.mimetype,
    //       size: file.size,
    //       articleId: article.id,
    //     });
    //   });
    //   await Promise.all(filePromises);
    // }
    console.log("File delete Successfully")
    res.redirect('back');
    // res.render("articles/edit", {
    //   article,
    //   users,
    // });
  },

  postEditArticle: async (req, res) => {
    const { title, content, category } = req.body;
    const article = await Article.findByPk(req.params.id, {
      include: File,
    });
    await Article.update(
      {
        title,
        content,
        category,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    // // Delete existing images from database
    // if (article.Files.length > 0) {
    //   for (let file of article.Files) {
    //     const filePath = path.join(__dirname, "..", file.path);

    //     // Delete file from filesystem
    //     if (fs.existsSync(filePath)) {
    //       fs.unlinkSync(filePath);
    //     }

    //     // Delete files
    //     await file.destroy();
    //   }
    // }

    // Save new uploaded image
    console.log("MMMM", req.files);
    if (req.files) {
      const filePromises = req.files.map((file) => {
        return File.create({
          filename: file.originalname,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          articleId: article.id,
        });
      });
      await Promise.all(filePromises);
    }

    res.redirect(`/articles/${req.params.id}`);
  },

  renderCreateArticle: (req, res) => {
    res.render("articles/create");
  },

  createArticle: async (req, res) => {
    try {
      const { title, content, category } = req.body;
      console.log("Userid:", req.user.id);
      const article = await Article.create({
        title,
        content,
        category,
        userId: req.user.id,
      });
      console.log(sequelize.models);
      //
      if (req.files) {
        const filePromises = req.files.map((file) => {
          return File.create({
            filename: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            articleId: article.id,
          });
        });
        await Promise.all(filePromises);
      }

      res.redirect("/articles");
      // const articles = await Article.findAll({ include: User });
      // console.log(articles.id)
      // res.render("articles/index", { articles })
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating article");
    }
  },
};

module.exports = articleControllers;
