import express from 'express'
import Logger from '../../common/logger'

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
  // Store the value of paramater `path` as `pathVariable`
  const pathVariable = req.body.path
  // Log the message to the console
  Logger.info(pathVariable)
  // Return a message to the caller
  res.json({ message: 'All done.' })
})

export default router
