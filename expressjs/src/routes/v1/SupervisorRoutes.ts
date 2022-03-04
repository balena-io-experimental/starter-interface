import axios from 'axios'
import express from 'express'
import queueCache from '../../middleware/queueCache'
import process from 'process'
import Logger from '../../common/logger'
import type { varRemoval } from '../../typings/supervisor'

const router = express.Router()

// Set Axios defaults
const supervisorAxios = axios.create({ timeout: 20000 })
supervisorAxios.defaults.baseURL = process.env.BALENA_SUPERVISOR_ADDRESS
supervisorAxios.defaults.headers.common.Authorization = `Bearer ${process.env.BALENA_SUPERVISOR_API_KEY}`

// Functions
function removeApiKeys(obj: varRemoval) {
  // Remove headers so the API key never leaves the device or enters logs
  if (obj.config?.headers?.Authorization) {
    delete obj.config.headers.Authorization
  }
  if (obj.request?._currentRequest) {
    delete obj.request._currentRequest
  }
  if (obj.request?._header) {
    delete obj.request._header
  }
  if (obj.response?.request?._header) {
    delete obj.response.request._header
  }

  Logger.debug('Removed API keys from Axios config data before returning')

  return obj
}

// -- Routes -- //
// Note that this route uses the queueCache middleware. Be aware of its implications
// when doing development.
router.post('/v1/supervisor', queueCache, function (req, res) {
  // Construct the payload
  const payload = {
    data: req.body.params,
    method: req.body.type,
    url: req.body.path
  }

  // Sned the request
  supervisorAxios(payload)
    .then((response) => {
      // Return the same http code as Axios request
      res.status(response.status)
      // Return only the data recieved from Axios (no headers)
      res.json(response.data)
      Logger.debug('Returned Supervisor data.')
    })
    .catch(function (error) {
      // Remove all API keys before handling the response
      const err = removeApiKeys(error)

      // Mirror the Axios status code
      if (err.response) {
        res.status(err.response.status)
      } else {
        res.status(500)
      }

      // Log to the console and return the error to the UI
      Logger.error(err)
      res.json(err)
    })
})

export default router
