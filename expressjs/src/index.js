import express from 'express'
import CustomRouter from './routes/CustomRoutes.js'
import SupervisorRouter from './routes/SupervisorRoutes.js'

// Initiate ExpressJS
const app = express()

// ExpressJS setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Routes
app.use(CustomRouter)
app.use(SupervisorRouter)

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
