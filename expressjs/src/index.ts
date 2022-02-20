import cors from 'cors'
import express from 'express'
import slowDown from 'express-slow-down'
import BalenaSDKRoutes from './routes/BalenaSDKRoutes'
import CustomRoutes from './routes/CustomRoutes'
import FileManagerRoutes from './routes/FileManagerRoutes'
import SupervisorRoutes from './routes/SupervisorRoutes'
import TestRoutes from './routes/TestRoutes'
import WifiRoutes from './routes/WifiConnectRoutes'

const port = process.env.BACKEND_PORT || 80

// Speed limit API requests. Useful for FileManager that can require large number of requests for
// uploads and deletes, and prevents abuse of the API.
const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // X minutes
  delayAfter: 100, // allow X requests per X minutes, then...
  delayMs: 200 // begin adding X ms of delay per request above X
})

// Initiate ExpressJS
const app = express()

// ExpressJS setup
app.locals.defaultCacheTimeout = 0 // Default cache timeout used when none is provided in payload. 0 is disabled.
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public', { dotfiles: 'allow' }))

// Routes
app.use(BalenaSDKRoutes)
app.use(CustomRoutes)
app.use(FileManagerRoutes)
app.use(SupervisorRoutes)
app.use(WifiRoutes)

// Add test routes outside of production environment
if (process.env.NODE_ENV !== 'production') {
  app.use(TestRoutes)
}

// Add speed limiter
app.use(speedLimiter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
