const express = require('express');
const router = express.Router();

// CONTROLLERS
const  userController = require('../controllers/userController');
const postsController = require('../controllers/authController')

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.delete('/:id',userController.deleteUser)

// ADMIN
router.get('/deleteall', userController.deleteAllUsers);

module.exports = router
