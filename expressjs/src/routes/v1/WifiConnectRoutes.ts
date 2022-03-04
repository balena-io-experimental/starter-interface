import axios from 'axios'
import express from 'express'
import Logger from '../../common/logger'

const router = express.Router()

// Set Axios defaults
const wifiAxios = axios.create({ timeout: 30000 })
wifiAxios.defaults.baseURL =
  process.env.WIFI_CONNECT_BASEURL ||
  `http://${process.env.BRIDGE_NETWORK_IP}:9090/`

// -- Routes -- //
router.post('/v1/wifi', function (req, res) {
  // Construct the payload
  const payload = {
    data: req.body.params,
    method: req.body.type,
    url: req.body.path
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
