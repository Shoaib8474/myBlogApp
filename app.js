const express = require('express');
const app = express();
const profileRoutes = require('./routes/profileRoutes');
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./models');
const cookieParser = require('cookie-parser');
require('dotenv').config();


// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(express.static('public'));


app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.redirect('/auth/register');
});

// Routes
app.use('/articles', articleRoutes);
app.use('/profiles', profileRoutes);


const PORT = process.env.PORT || 3000
// Sync Database

// sequelize.drop({force: true}).then(()=> {
//   console.log("Database deleted sucess")
// })
// sequelize.drop().then(()=> {
//   console.log("Database deleted sucess")
// })

console.log(sequelize.models)
sequelize.sync({alter: true})
    .then(() => {
        console.log('Database connected and synced.');
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error('Database connection failed:', err));
