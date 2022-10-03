//
// Some test endpoints available only when running in development mode.
//

import Logger from '@/common/logger'
import queueCache from '@/middleware/queueCache'
import express from 'express'

// Get the ExpressJS main router process
const router = express.Router()

// Cache tests
router.get('/v1/test/cache', queueCache, (_req, res) => {
  Logger.warn('Running test route.')
  res.send({ test: 'Testing Cache' })
})

// Cache tests
router.get('/v1/test/cache2', queueCache, (_req, res) => {
  Logger.warn('Running test route.')
  res.send({ test2: 'Testing Cache 2' })
})

export default router
