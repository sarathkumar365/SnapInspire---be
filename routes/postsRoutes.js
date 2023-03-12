const express = require('express');
const router = express.Router();


// CONTROLLERS
const postsController = require('../controllers/postsController')

router.get('/',postsController.getPosts)
router.post('/',postsController.uploadPosts)

module.exports = router