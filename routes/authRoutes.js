const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');

const {registerSchema,loginSchema} = require('../validators/validations')

router.get('/login', authController.getLogin);
router.post('/login', validate(loginSchema), authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', validate(registerSchema), authController.postRegister);
router.get('/logout', authController.logout);

module.exports = router;