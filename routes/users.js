const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')

router
  .route('/')
  .post(userController.registerUser)

router.post('/login', userController.login)

module.exports = router
