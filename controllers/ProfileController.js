const { User, Article, Profile, Like } = require('../models');

const profileControllers = {
    getProfile: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId, { 
                include: [
                    {model: Profile},
                    {model: Like}
                ] 
            });
            console.log(user.Likes);
            // res.json({user});
            // Check if the current user has liked this article
            // const userId = req.user ? req.user.id : null;
            const authorisedUser = (user.id === req.user?.id)? true : false;
            console.log(authorisedUser)
            if (!user) return res.status(404).send('User not found');
            res.render('profiles/show', { user, authorisedUser });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },

    getEditProfile: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId, { include: Profile });
            if (!user) return res.status(404).send('User not found');
            res.render('profiles/edit', { user });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
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
            res.redirect(`/profiles/${userId}`);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },
    deleteProfile:  async (req, res) => {
        await Profile.destroy({ where: { id: req.params.id } });
        res.redirect('/articles');
    },
    articleLiked: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId, { 
                include: [
                    {model: Article},
                    {model: Profile},
                    {model: Like}
                ] 
            });
            console.log(user.Likes);
            // res.json({user});
            // Check if the current user has liked this article
            // const userId = req.user ? req.user.id : null;
            // const authorisedUser = (user.id === req.user?.id)? true : false;
            // console.log(authorisedUser)
            if (!user) return res.status(404).send('User not found');
            res.render('likes/show', { user });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = profileControllers;