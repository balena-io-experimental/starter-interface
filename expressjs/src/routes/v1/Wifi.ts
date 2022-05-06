import request, { AxiosRequestConfig } from 'axios'
import express, { Request, RequestHandler, Response } from 'express'
import process from 'process'
import createAxiosInstance from '@/common/axios'
import Logger from '@/common/logger'

interface reqBodyData {
  params: Array<string>
  path: string
  type: string
}

const router = express.Router()

// Set Axios defaults
const wifiAxios = createAxiosInstance()
wifiAxios.defaults.timeout = 30000

if (process.env.WIFI_CONNECT_BASEURL) {
  wifiAxios.defaults.baseURL = process.env.WIFI_CONNECT_BASEURL
} else if (process.env.NETWORK_MODE?.toLowerCase() === 'bridge') {
  wifiAxios.defaults.baseURL = `http://${
    process.env.BRIDGE_NETWORK_IP as string
  }:9090/`
} else {
  wifiAxios.defaults.baseURL = `http://127.0.0.1:9090/`
}

// -- Routes -- //
router.post('/v1/wifi', (async (req: Request, res: Response) => {
  // Construct the payload
  const reqBody = req.body as reqBodyData

  const payload = {
    data: reqBody.params,
    method: reqBody.type,
    url: reqBody.path
  } as AxiosRequestConfig

  // Send the request
  try {
    const response = await wifiAxios(payload)

    Logger.debug('Returning wifi-connect request.')
    // Return the same http code as Axios request
    res.status(response.status)
    // Return only the data received from Axios
    res.json(response.data)
  } catch (error) {
    // Mirror the Axios status code
    if (request.isAxiosError(error) && error.response) {
      res.status(error.response.status)
    } else {
      res.status(500)
    }

    // Return the error to the UI
    res.json(error)
  }
}) as RequestHandler)

export default router
