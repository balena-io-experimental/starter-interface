import { AxiosError, AxiosRequestConfig } from 'axios'
import createAxiosInstance from '@/common/axios'
import express, { Request, Response } from 'express'
import Logger from '@/common/logger'
import process from 'process'

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
router.post('/v1/wifi', function (req: Request, res: Response) {
  // Construct the payload
  const reqBody = req.body as reqBodyData

  const payload = {
    data: reqBody.params,
    method: reqBody.type,
    url: reqBody.path
  } as AxiosRequestConfig

  // Send the request
  wifiAxios(payload)
    .then((response) => {
      Logger.debug('Returning wifi-connect request.')
      // Return the same http code as Axios request
      res.status(response.status)
      // Return only the data recieved from Axios (no headers)
      res.json(response.data)
    })
    .catch(function (error: AxiosError) {
      // Mirror the Axios status code
      if (error.response) {
        res.status(error.response.status)
      } else {
        res.status(500)
      }

      // Return the error to the UI
      res.json(error)
    })
})

export default router
