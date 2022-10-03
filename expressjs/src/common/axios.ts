//
// Axios configuration
//

import Logger from '@/common/logger'
import axios, { AxiosError } from 'axios'

// Axios instance generator. It allows instances to be created in the file using it. By
// using a generator the different instances can share common interceptors but still have
// their own independent instance with custom timeouts and other configuration.
export default function createAxiosInstance() {
  const newInstance = axios.create()

  // Axios request interceptor
  newInstance.interceptors.request.use(
    (config) => config,
    (error: Error | AxiosError) => {
      if (axios.isAxiosError(error) && error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        Logger.error('Axios received no response.')
        Logger.error(error.request)
      } else {
        Logger.error(error)
      }
      // Reject with Axios error
      return Promise.reject(error)
    }
  )

  // Axios response interceptor
  newInstance.interceptors.response.use(
    (response) => response,
    (error: Error | AxiosError) => {
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Logger.error(`Axios returned status code: ${error.response.status}.`)
        Logger.error(error.response.data)
        Logger.debug(error.response.headers)
      } else {
        Logger.error(error)
      }
      // Reject with Axios error
      return Promise.reject(error)
    }
  )
  return newInstance
}
