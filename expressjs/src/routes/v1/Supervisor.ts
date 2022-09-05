import createAxiosInstance from '@/common/axios'
import Logger from '@/common/logger'
import queueCache from '@/middleware/queueCache'
import request, { AxiosRequestConfig } from 'axios'
import express, { Request, Response } from 'express'
import path from 'path'
import process from 'process'

interface reqBodyData {
  params: Array<string>
  path: string
  path2: string
  type: string
}

const router = express.Router()

// Create Axios instance and set defaults
const supervisorAxios = createAxiosInstance()
supervisorAxios.defaults.timeout = 20000
supervisorAxios.defaults.baseURL = process.env.BALENA_SUPERVISOR_ADDRESS
supervisorAxios.defaults.headers.common.Authorization = `Bearer ${
  process.env.BALENA_SUPERVISOR_API_KEY as string
}`

// -- Routes -- //
// Note that this route uses the queueCache middleware. Be aware of its implications
// when doing development.
router.post(
  '/v1/supervisor',
  queueCache,
  async (req: Request, res: Response) => {
    const reqBody = req.body as reqBodyData

    // If Balena App ID is required
    let url
    if (reqBody.path2) {
      url = path.join(
        reqBody.path,
        process.env.BALENA_APP_ID as string,
        reqBody.path2
      )
    } else {
      url = reqBody.path
    }

    // Construct the payload
    const payload = {
      data: reqBody.params,
      method: reqBody.type,
      url
    }

    // Send the request
    try {
      const response = await supervisorAxios(payload as AxiosRequestConfig)

      // Return the same http code as Axios request
      res.status(response.status)
      // Return only the data received from Axios (no headers)
      res.json(response.data)
      Logger.debug('Returned Supervisor data.')
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
  }
)

export default router
