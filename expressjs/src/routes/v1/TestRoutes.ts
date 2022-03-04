import express from 'express'
import Logger from '@/common/logger'
import queueCache from '@/middleware/queueCache'

const router = express.Router()

// Define your custom GET route path and actions
router.get('/v1/test/cacheping', queueCache, function (_req, res) {
  // Log to the console that this is running
  Logger.warn('Running test route.')
  // Actions to take when this route is visited go here.
  res.send({ test: 'Testing Cache' })
})

export default router
