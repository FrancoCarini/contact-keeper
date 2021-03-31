const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/auth')
const userController = require('../controllers/users')

router
  .route('/')
  .post(userController.registerUser)
  .get(protect, userController.getUser)

router.post('/login', userController.login)

module.exports = router
