//
// Primary config for the backend
//

import boot from '@/boot'
import BalenaSDK from '@/routes/v1/BalenaSDK'
import CaptivePortal from '@/routes/v1/CaptivePortal'
// import Examples from '@/routes/v1/Examples'
import FileManager from '@/routes/v1/FileManager'
import Supervisor from '@/routes/v1/Supervisor'
import System from '@/routes/v1/System'
import Tests from '@/routes/v1/Tests'
import Wifi from '@/routes/v1/Wifi'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import slowDown from 'express-slow-down'
import process from 'process'

// Run custom boot processes
boot()

// Set backend port number
const port = process.env.BACKEND_PORT || 80

// Speed limit API requests to prevent abuse of the API.
const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // X minutes
  delayAfter: 100, // allow X requests per X minutes, then...
  delayMs: 200 // begin adding X ms of delay per request above X
})

// Initiate ExpressJS
const app = express()

/** 
==========================================================
ExpressJS setup. Order of these functions is important.
==========================================================
*/

// Default balena UI middleware cache timeout. 0 is disabled.
app.locals.defaultCacheTimeout = 0
// Allow CORS
app.use(cors())
// Import JSON functionality
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Add a low compression, considerate of low resource devices. Level 1 can reduce
// some asset sizes by 50%. Gains from 2 and up are marginal but require more hardware
// resources to achieve.
app.use(compression({ level: 1 })) //
// Enable sharing of static files
app.use(express.static('public'))

// ==========================================================

// Import routes
app.use(BalenaSDK)
app.use(CaptivePortal)
// app.use(Examples)
app.use(FileManager)
app.use(Supervisor)
app.use(System)
app.use(Wifi)

// Add test routes when outside of production environment
if (process.env.NODE_ENV !== 'production') {
  app.use(Tests)
}

// Add speed limiter that was configured above
app.use(speedLimiter)

// Start and listen for requests
app.listen(port, () => {
  console.log(`ExpressJS: listening on port ${port}`)
})
