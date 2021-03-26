const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')

// Generate token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  // Since user is returned set password undefined in user object
  user.password = undefined

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  // In production mode add secure field to true
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })  
}

exports.registerUser = asyncHandler(async (req, res, next) => {
  const {name, email, password} = req.body

  // Create user in DB
  const newUser = await User.create({
    name,
    email,
    password
  })

  // Generate JWT Token and send
  createSendToken(newUser, 201, res)
})

exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body

  // Check if email and password are in request
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  // Check if exists user with that email
  const user = await User.findOne({email}).select('+password')
  if (!user) return next(new AppError('Incorrect email or passowrd', 401))

  // Check if password match
  const isCorrectPassword = await user.correctPassword(password, user.password)
  if (!isCorrectPassword) return next(new AppError('Incorrect email or passowrd', 401))

  createSendToken(user, 200, res)
})
