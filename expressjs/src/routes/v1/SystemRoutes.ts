import express from 'express'
import dns = require('dns')
import Logger from '../../common/logger'

const router = express.Router()

// -- Routes -- //
router.get('/v1/system/internet_check', function (_req, res) {
  Logger.debug('Running internet connectivity check.')
  dns.lookup('google.com', function (err) {
    if (err && err.code == 'ENOTFOUND') {
      res.json({ internet: false })
    } else {
      res.json({ internet: true })
    }
  })
})

export default router
