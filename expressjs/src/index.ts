import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import BalenaSDKRoutes from './routes/BalenaSDKRoutes'
import CustomRoutes from './routes/CustomRoutes'
import FileManagerRoutes from './routes/FileManagerRoutes'
import SupervisorRoutes from './routes/SupervisorRoutes'
import TestRoutes from './routes/TestRoutes'
import WifiRoutes from './routes/WifiConnectRoutes'

const port = process.env.BACKEND_PORT || 80

// Rate limiter settings
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
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

// Add rate-limiter
app.use(limiter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
