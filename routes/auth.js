const express = require('express');
const authController = require("../controller/auth")
const { check, validationResult } = require('express-validator')
const routerAuth = express.Router();

routerAuth.post('/login', authController.handleLogin)

routerAuth.get('/logout',authController.handleLogout);

routerAuth.get('/register', authController.GetRegisterPage)


routerAuth.post('/register', authController.PostRegister)



module.exports = routerAuth;