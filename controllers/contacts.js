const asyncHandler = require('express-async-handler')
const Contact = require('../models/Contact')

exports.getContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find({user: req.user.id})
    .sort({date: -1})

  res.status(200).json({
    success: true,
    data: contacts
  })
})

exports.addContact = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id
  const contact = await Contact.create(req.body)

  res.status(201).json({
    success: true,
    data: contact
  })
})

exports.updateContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return next(new AppError(`No contact find with id ${req.params.id}`, 404))
  }

  // Check if contact belong to user
  if (contact.user.toString() !== req.user.id) {
    return next(new AppError(`Not authorized to get this contact`, 401))
  }

  await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: contact
  })
})

exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return next(new AppError(`No contact find with id ${req.params.id}`, 404))
  }

  // Check if contact belong to user
  if (contact.user.toString() !== req.user.id) {
    return next(new AppError(`Not authorized to delete this contact`, 401))
  }

  await Contact.findByIdAndDelete(req.params.id)

  res
    .status(200)
    .json({
      status: 'success',
      data: null
    })
})
