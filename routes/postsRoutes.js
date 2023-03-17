const express = require('express');
const router = express.Router();


// CONTROLLERS
const postsController = require('../controllers/postsController')

router.get('/',postsController.getPosts)
router.post('/',postsController.uploadPosts)
router.patch('/:imageId',postsController.liked)

module.exports = router