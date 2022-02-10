import express from 'express'
import cors from 'cors'
import CustomRoutes from './routes/CustomRoutes.js'
import SupervisorRoutes from './routes/SupervisorRoutes.js'
import BalenaSDKRoutes from './routes/BalenaSDKRoutes.js'

const port = process.env.BACKEND_PORT || 3000

// Initiate ExpressJS
const app = express()

// ExpressJS setup
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Routes
app.use(CustomRoutes)
app.use(SupervisorRoutes)
app.use(BalenaSDKRoutes)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
