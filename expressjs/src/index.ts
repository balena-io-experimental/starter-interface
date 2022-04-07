import boot from '@/boot'
import cors from 'cors'
import express from 'express'
import process from 'process'
import slowDown from 'express-slow-down'
import BalenaSDK from '@/routes/v1/BalenaSDK'
import CaptivePortal from '@/routes/v1/CaptivePortal'
import Examples from '@/routes/v1/Examples'
import FileManager from '@/routes/v1/FileManager'
import Supervisor from '@/routes/v1/Supervisor'
import System from '@/routes/v1/System'
import Tests from '@/routes/v1/Tests'
import Wifi from '@/routes/v1/Wifi'

// Run custom boot processes
boot()

// Set backend port number
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
app.locals.defaultCacheTimeout = 0 // Default middleware cache timeout used when none is provided in payload. 0 is disabled.
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public', { dotfiles: 'allow' }))

// Routes
app.use(BalenaSDK)
app.use(CaptivePortal)
app.use(Examples)
app.use(FileManager)
app.use(Supervisor)
app.use(System)
app.use(Wifi)

// Add test routes outside of production environment
if (process.env.NODE_ENV !== 'production') {
  app.use(Tests)
}

// Add speed limiter
app.use(speedLimiter)

app.listen(port, () => {
  console.log(`ExpressJS: listening on port ${port}`)
})
