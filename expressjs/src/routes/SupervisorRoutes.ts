import axios from 'axios'
import express from 'express'
import process from 'process'
import type { varRemoval } from '../common/types'

const router = express.Router()

// Set Axios defaults
axios.defaults.baseURL = process.env.BALENA_SUPERVISOR_ADDRESS
axios.defaults.headers.common.Authorization = `Bearer ${process.env.BALENA_SUPERVISOR_API_KEY}`
axios.defaults.timeout = 2500

// Functions
function removeApiKeys (obj: varRemoval) {
  // Remove headers so the API key never leaves the device or enters logs
  if (obj.config?.headers?.Authorization) { delete obj.config.headers.Authorization }
  if (obj.request?._currentRequest) { delete obj.request._currentRequest }
  if (obj.request?._header) { delete obj.request._header }
  if (obj.response?.request?._header) { delete obj.response.request._header }

  return obj
}

// Routes
router.post('/supervisor', function (req, res) {
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
  axios(payload)
    .then((response) => {
      // Return the same http code as Axios request
      res.status(response.status)
      // Return only the data recieved from Axios (no headers)
      res.json(response.data)
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
      console.log(err)
      res.json(err)
    })
})

export default router
