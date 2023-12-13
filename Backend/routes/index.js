const express = require('express')
const router = express();
const authController = require('../controller/authController')
const blogController = require('../controller/blogController')
const auth = require('../middleware/auth')
const commentController = require('../controller/commentController')


// Auth End Points

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/logout',auth, authController.logout)

router.get('/refresh', authController.refresh);

// Blog End Points

router.post('/blog', auth, blogController.create)

router.get('/blog/all',auth, blogController.getAll)

router.get('/blog/:id', auth, blogController.getById)

router.put('/blog', auth, blogController.update);

router.delete('/blog/:id', auth, blogController.delete)

// Comment End Points

router.post('/comment' , auth , commentController.create)

router.get('/comment/:id', auth , commentController.getById)


module.exports = router;