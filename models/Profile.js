const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bio: {
        type: DataTypes.STRING,
    },
    avatar: {
        type: DataTypes.STRING,
    },
}, { timestamps: true });


module.exports = Profile;