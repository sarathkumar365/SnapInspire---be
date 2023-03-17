const express = require('express');
const router = express.Router();


// CONTROLLERS
const postsController = require('../controllers/postsController')

router.get('/',postsController.getAllPosts)
router.post('/',postsController.uploadPosts)
router.patch('/:id/:incORdec',postsController.applaud)

module.exports = router