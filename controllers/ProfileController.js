const { User, Article, Profile, Like, File} = require("../models");
const fs = require("fs");
const path = require("path");

const profileControllers = {
  getProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId, {
        include: [
            { model: Profile,
                include: [{ model: File }],
             }, 
            { model: Like }

        ],
      });

      // const file = await File.findOne({where: {profileId: user.Profile?.id}})
      // console.log(user.Likes);
      console.log(user?.Profile?.File)
      // res.json({user});
      // Check if the current user has liked this article
      // const userId = req.user ? req.user.id : null;
      const authorisedUser = user.id === req.user?.id ? true : false;
      console.log(authorisedUser);
      if (!user) return res.status(404).send("User not found");
      res.render("profiles/show", { user, authorisedUser });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  getEditProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId, { include: Profile });
      if (!user) return res.status(404).send("User not found");
      res.render("profiles/edit", { user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
  postEditProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const { bio, avatar } = req.body;

      let profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        profile = await Profile.create({ userId, bio, avatar });
      } else {
        await profile.update({ bio, avatar });
      }

      ////
      const file = await File.findOne({ where: { profileId: profile.id } });
      // if (!file) return res.status(404).send('Image not found');
      if (file) {
        // Delete old image from filesystem
        const oldFilePath = path.join(__dirname, "..", file.path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      console.log("Profile: metadata", req.file)
      // Update database record with new image details
      await File.create({
        filename: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        profileId: profile.id,
      });

      res.redirect(`/profiles/${userId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteProfile: async (req, res) => {
    console.log("userID Article:", req.user.id);
    await Article.destroy({ where: { userId: req.user.id } });
    await User.destroy({ where: { id: req.user.id } });
    res.redirect("/auth/register");
  },
  articleLiked: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId, {
        include: [{ model: Article }, { model: Profile }, { model: Like }],
      });
      console.log(user.Likes);
      // res.json({user});
      // Check if the current user has liked this article
      // const userId = req.user ? req.user.id : null;
      // const authorisedUser = (user.id === req.user?.id)? true : false;
      // console.log(authorisedUser)
      if (!user) return res.status(404).send("User not found");
      res.render("likes/show", { user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = profileControllers;
