const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contacts')
const { protect } = require('../middlewares/auth')

router
  .route('/')
  .get(protect, contactController.getContacts)
  .post(protect, contactController.addContact)

router
  .route('/:id')
  .put(protect, contactController.getContacts)
  .delete(protect, contactController.addContact)
module.exports = router
