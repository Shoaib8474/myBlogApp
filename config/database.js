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

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to MySQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,  process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql'
// });

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("freedb_mysqldatabase", "freedb_admin_db1", "HCP2fH@6JUEFxKQ", {
//   host: "sql.freedb.tech",
//   port: 3306,
//   dialect: "mysql",
//   dialectOptions: {
//     ssl: {
//       require: true, // Enforce SSL mode
//       rejectUnauthorized: false, // Allow self-signed certificates
//     },
//   },
//   logging: false, // Disable logging (optional)
// });

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection to MySQL has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// })();


module.exports = sequelize;
