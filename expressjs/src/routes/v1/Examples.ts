//
// Example endpoints for users to create there own. These are not imported by default. Instead
// the user must specify to import this file from expressjs/src/index.ts
//

import Logger from '@/common/logger'
import express from 'express'

interface MyData {
  mySentData: string
}

// Get the ExpressJS main router process
const router = express.Router()

// Define your custom GET route path and actions
router.get('/v1/example_route_get', (_req, res) => {
  // Log to the console that this is running
  Logger.warn('Running content of example_route_get route.')
  // Actions to take when this route is visited go here.
  res.send('I am being sent back to the browser')
})

// Define your custom POST route
router.post('/v1/example_route_post', (req, res) => {
  const reqBody = req.body as MyData
  // Store the value of parameter `mySentData` as `mySentDataVariable`
  const mySentDataVariable = reqBody.mySentData
  // Log the message to the console
  Logger.info(mySentDataVariable)
  // Return a message to the caller
  res.json({ message: 'All done.' })
})

export default router
