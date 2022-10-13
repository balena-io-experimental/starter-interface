//
// Interact with Python WiFi Connect (https://github.com/balena-labs-research/python-wifi-connect) to
// modify WiFi status of the device.
//

import createAxiosInstance from '@/common/axios'
import Logger from '@/common/logger'
import request, { AxiosRequestConfig } from 'axios'
import express, { Request, RequestHandler, Response } from 'express'
import process from 'process'

// Interface for the WiFi payload
interface BodyDataReq {
  params: Array<string>
  path: string
  type: string
}

// Get the ExpressJS main router process
const router = express.Router()

// Set Axios defaults
const wifiAxios = createAxiosInstance()
wifiAxios.defaults.timeout = 30000

if (process.env.WIFI_CONNECT_BASEURL) {
  // If there is a specific base URL set in the compose file
  wifiAxios.defaults.baseURL = process.env.WIFI_CONNECT_BASEURL
} else if (process.env.NETWORK_MODE?.toLowerCase() === 'bridge') {
  // If the user specified to use the bridge network in the compose file then
  // fetch it from the environment variable set in the start.sh script
  wifiAxios.defaults.baseURL = `http://${
    process.env.BRIDGE_NETWORK_IP as string
  }:9090/`
} else {
  // If nothing set, use a default
  wifiAxios.defaults.baseURL = `http://127.0.0.1:9090/`
}

// -- Routes -- //
router.post('/v1/wifi', (async (req: Request, res: Response) => {
  // Construct the payload from the passed variables ready for submitting to the Python WiFi
  // container
  const reqBody = req.body as BodyDataReq
  const payload = {
    data: reqBody.params,
    method: reqBody.type,
    url: reqBody.path
  } as AxiosRequestConfig

  // Send the request
  try {
    const response = await wifiAxios(payload)

    Logger.debug('Returning wifi-connect request.')

    // Set to the same http code as request to WiFi container
    res.status(response.status)

    // Return the data received from WiFi container to the UI
    res.json(response.data)
  } catch (error) {
    // Mirror the Axios status code
    if (request.isAxiosError(error) && error.response) {
      res.status(error.response.status)
    } else {
      res.status(500)
    }

    // Return the error to the users browser
    res.json(error)
  }
}) as RequestHandler)

export default router
