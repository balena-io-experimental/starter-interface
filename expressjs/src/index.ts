import cors from 'cors'
import express from 'express'
import BalenaSDKRoutes from './routes/BalenaSDKRoutes'
import CustomRoutes from './routes/CustomRoutes'
import FileManagerRoutes from './routes/FileManagerRoutes'
import SupervisorRoutes from './routes/SupervisorRoutes'
import TestRoutes from './routes/TestRoutes'
import WifiRoutes from './routes/WifiConnectRoutes'

const port = process.env.BACKEND_PORT || 80

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
