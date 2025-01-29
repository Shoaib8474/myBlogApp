const { sequelize, User, Profile, Article, Like, Follow } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authController = {

    getLogin: (req, res) => {
        res.render('signup/login');
      },

    getRegister: (req, res) => {
        res.render('signup/register');
      },
    
      postRegister: async (req, res) => {
        try {
          const { email, password, username } = req.body;
          console.log(email+password);
          await User.create({ email, password, username });
          res.redirect('/auth/login');
        } catch (error) {
            console.log(error);
          res.render('signup/register', { error: 'Registration failed' });
        }
      },
    
      postLogin: async (req, res) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ where: { email } });
    
          if (!user) {
            return res.render('signup/login', { error: 'Invalid credentials' });
          }
    
          // const validPassword = await bcrypt.compare(password, user.password);
          // if (!validPassword) {
          //   return res.render('signup/login', { error: 'Invalid credentials' });
          // }
    
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
    
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3600000 // 1 hr
          });
          console.log("I got here")
          res.redirect('/articles');
        } catch (error) {
          res.render('signup/login', { error: 'Login failed' });
        }
      },
    
      logout: (req, res) => {
        res.clearCookie('jwt');
        res.redirect('/auth/login');
      }
    };
    
    

module.exports = authController;