const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('jwt');
    return res.redirect('/auth/login');
  }
};

module.exports = { authenticateToken };
