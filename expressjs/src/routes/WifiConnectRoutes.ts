import axios from 'axios'
import express from 'express'
import dns = require('dns')
import Logger from '../common/logger'

const router = express.Router()

// Set Axios defaults
const wifiAxios = axios.create({ timeout: 5000 })
wifiAxios.defaults.baseURL =
  process.env.WIFI_CONNECT_BASEURL ||
  `http://${process.env.BRIDGE_NETWORK_IP}:9090/`

// -- Routes -- //
router.get('/internet_check', function (_req, res) {
  dns.lookupService('8.8.8.8', 53, function (err) {
    if (err === null) {
      res.json({ internet: true })
    } else if (err && err.code == 'ENOTFOUND') {
      res.json({ internet: false })
    } else {
      Logger.error(err)
      throw new Error('Error checking internet connectivity.')
    }
  })
})

router.post('/wifi', function (req, res) {
  const params = req.body.params
  const path = req.body.path
  const type = req.body.type

  // Construct the payload
  const payload = {
    data: params,
    method: type,
    url: path
  }

  // Sned the request
  wifiAxios(payload)
    .then((response) => {
      Logger.debug('Returning wifi-connect request.')
      // Return the same http code as Axios request
      res.status(response.status)
      // Return only the data recieved from Axios (no headers)
      res.json(response.data)
    })
    .catch(function (error) {
      // Mirror the Axios status code
      if (error.response) {
        res.status(error.response.status)
      } else {
        res.status(500)
      }

      // Log to the console and return the error to the UI
      Logger.error(error)
      res.json(error)
    })
})

export default router
