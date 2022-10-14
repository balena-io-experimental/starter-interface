//
// Interact with the balena Supervisor on the local device
//

import createAxiosInstance from '@/common/axios'
import Logger from '@/common/logger'
import queueCache from '@/middleware/queueCache'
import request, { AxiosRequestConfig } from 'axios'
import express, { Request, RequestHandler, Response } from 'express'
import path from 'path'
import process from 'process'

// Interface for the payload
interface BodyDataReq {
  params: Array<string>
  path: string
  path2: string
  type: string
}

// Get the ExpressJS main router process
const router = express.Router()

// Create Axios instance and set defaults
const supervisorAxios = createAxiosInstance()
supervisorAxios.defaults.timeout = 20000
supervisorAxios.defaults.baseURL = process.env.BALENA_SUPERVISOR_ADDRESS
supervisorAxios.defaults.headers.common.Authorization = `Bearer ${
  process.env.BALENA_SUPERVISOR_API_KEY as string
}`

// -- Routes -- //
// Note that this route uses the queueCache middleware set by `queueCache`.
// Be aware of its implications when doing development.
router.post('/v1/supervisor', queueCache, (async (
  req: Request,
  res: Response
) => {
  const reqBody = req.body as BodyDataReq

  //  Unfortunately the Supervisor URLs are not currently standardised
  // and this provides a workaround. If Balena App ID is required as
  // part of the Supervisor URL then add it to the payload.
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

    // Return the same http code as the one Supervisor returned
    res.status(response.status)
    // Return the Supervisor response to the UI
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
}) as RequestHandler)

export default router
