import express from 'express'
import Logger from '../common/logger'

const router = express.Router()

// Define your custom get route
router.get('/exampleroute_get', function (_req, res) {
  res.send('Example route')
})

// Define your custom post route
router.post('/exampleroute_post', function (req, res) {
  // Store the value of 'path' submitted as JSON to this endpoint as 'pathVariable'
  const pathVariable = req.body.path
  // Log the message to the console
  Logger.info(pathVariable)
  // Return a message to the caller
  res.send('done')
})

export default router
