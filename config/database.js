const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,  process.env.DB_PASSWORD, {
  
  host: process.env.DB_HOST,
  port: 20765,
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true, // Enforce SSL mode
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  },
  logging: false, // Disable logging (optional)
});



module.exports = sequelize;
