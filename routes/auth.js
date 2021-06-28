const express = require('express');
const authController = require("../controller/auth")
const { check, validationResult } = require('express-validator')
const routerAuth = express.Router();

routerAuth.post('/login', authController.handleLogin)

routerAuth.get('/logout',authController.handleLogout);

routerAuth.get('/register', authController.GetRegisterPage)


routerAuth.post('/register', [
    check('username', 'This username must be 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('username', 'This username cannot has special characters')
        .isAlphanumeric(),
    check('email', 'Email is not valid')
        .isEmail()
        .normalizeEmail(),
    check('password', 'Password must be 6+ characters long')
        .exists()
        .isLength({ min: 6 })
], authController.PostRegister)



module.exports = routerAuth;