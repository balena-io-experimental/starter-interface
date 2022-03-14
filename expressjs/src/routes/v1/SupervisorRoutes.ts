import axios, {
  AxiosRequestHeaders,
  AxiosRequestConfig,
  AxiosError
} from 'axios'
import Logger from '@/common/logger'
import express, { Request, Response } from 'express'
import queueCache from '@/middleware/queueCache'
import path from 'path'
import process from 'process'

interface reqBodyData {
  params: Array<string>
  path: string
  path2: string
  type: string
}

interface varRemoval {
  config: {
    headers: {
      Authorization?: AxiosRequestHeaders
    }
  }
  response: {
    request: {
      _header?: AxiosRequestHeaders
    }
    status: number
  }
  request: {
    _header?: AxiosRequestHeaders
    _currentRequest?: AxiosRequestHeaders
  }
}

const router = express.Router()

// Set Axios defaults
const supervisorAxios = axios.create({ timeout: 20000 })
supervisorAxios.defaults.baseURL = process.env.BALENA_SUPERVISOR_ADDRESS
supervisorAxios.defaults.headers.common.Authorization = `Bearer ${
  process.env.BALENA_SUPERVISOR_API_KEY as string
}`

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
router.post(
  '/v1/supervisor',
  queueCache,
  function (req: Request, res: Response) {
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
      url: url
    }

    // Send the request
    supervisorAxios(payload as AxiosRequestConfig)
      .then((response) => {
        // Return the same http code as Axios request
        res.status(response.status)
        // Return only the data recieved from Axios (no headers)
        res.json(response.data)
        Logger.debug('Returned Supervisor data.')
      })
      .catch(function (error: AxiosError) {
        // Remove all API keys before handling the response
        const err = removeApiKeys(error as varRemoval)

        // Mirror the Axios status code
        if (err.response) {
          res.status(err.response.status)
        } else {
          res.status(500)
        }

        // Return the error to the UI
        res.json(err)
      })
  }
)

export default router
