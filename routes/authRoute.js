const express = require('express');
const router = express.Router();

// CONTROLLERS
const  authController = require('../controllers/authController');

router.post('/login', authController.login);
// router.get('/', userController.getAllUsers);

module.exports = router
