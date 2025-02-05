const sequelize = require('../config/database');
const User = require('./User.js');
const Profile = require('./Profile.js');
const Article = require('./Article.js');
const Like = require('./Like.js');
const File = require('./File.js');


User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

Profile.hasOne(File, { foreignKey: 'profileId', onDelete: 'CASCADE' });
File.belongsTo(Profile, { foreignKey: 'profileId' });

User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

Article.hasMany(File, { foreignKey: 'articleId', onDelete: 'CASCADE' });
File.belongsTo(Article, { foreignKey: 'articleId' });

User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId' });

Article.hasMany(Like, { foreignKey: 'articleId', onDelete: 'CASCADE' });
Like.belongsTo(Article, { foreignKey: 'articleId' });


// sequelize.sync()
//   .then(() => {
//       console.log(`Server is running on port`);
//     });
// (async () => {
//     console.log(sequelize.models)
//   })()


module.exports = { sequelize, User, Profile, Article, Like, File};