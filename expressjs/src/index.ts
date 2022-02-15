import express from 'express'
import cors from 'cors'
import BalenaSDKRoutes from './routes/BalenaSDKRoutes'
import CustomRoutes from './routes/CustomRoutes'
import SupervisorRoutes from './routes/SupervisorRoutes'

const port = process.env.BACKEND_PORT || 80

// Initiate ExpressJS
const app = express()

// ExpressJS setup
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Routes
app.use(BalenaSDKRoutes)
app.use(CustomRoutes)
app.use(SupervisorRoutes)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
