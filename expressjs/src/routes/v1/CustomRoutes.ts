import express from 'express'
import Logger from '@/common/logger'

interface myData {
  mySentData: string
}

const router = express.Router()

// Define your custom GET route path and actions
router.get('/v1/example_route_get', function (_req, res) {
  // Log to the console that this is running
  Logger.warn('Running content of example_route_get route.')
  // Actions to take when this route is visited go here.
  res.send('I am being sent back to the browser')
})

// Define your custom POST route
router.post('/v1/example_route_post', function (req, res) {
  const reqBody = req.body as myData
  // Store the value of paramater `mySentData` as `mySentDataVariable`
  const mySentDataVariable = reqBody.mySentData
  // Log the message to the console
  Logger.info(mySentDataVariable)
  // Return a message to the caller
  res.json({ message: 'All done.' })
})

export default router
