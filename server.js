const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const AppError =  require('./utils/appError')
const errorHandler = require('./middlewares/errors')
const userRoutes = require('./routes/users')
const contactRoutes = require('./routes/contacts')

// DotEnv Config File
dotenv.config({path: './config/config.env'})

// DB Connect
mongoose.connect(process.env.DATABASE, { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB'))
.catch(err => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})

// Express App
const app = express()

// Body Parser
app.use(express.json({limit: '10kb'}))

// Mount Routes
app.use('/api/users', userRoutes)
app.use('/api/contacts', contactRoutes)

// PORT
const PORT = process.env.PORT || 5000

// Error Middleware
app.use(errorHandler)

// Server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION! Shutting down ...')
  server.close(() => {
    process.exit(1)
  })
})
