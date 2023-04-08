const express = require('express');
const router = express.Router();

const {verifyToken} = require('../utils/factoryFunctions')


// CONTROLLERS
const postsController = require('../controllers/postsController')

router.get('/',verifyToken,postsController.getAllPosts)
router.post('/',verifyToken,postsController.uploadPosts)
router.patch('/:id/:incORdec',postsController.applaud)

// ADMIN
router.get('/deleteAll',postsController.deleteAllPosts)

module.exports = router