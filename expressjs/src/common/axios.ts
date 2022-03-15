import axios, { AxiosError } from 'axios'
import Logger from '@/common/logger'

// Axios instance generator. It allows Axios instances to share interceptors and
// allows instances to be created in the file using it. This means when someone deletes
// a component, there are no dangling Axios instances.
export default function createAxiosInstance() {
  const newInstance = axios.create()

  // Axios request interceptor
  newInstance.interceptors.request.use(
    function (config) {
      return config
    },
    function (error: Error | AxiosError) {
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
    function (response) {
      return response
    },
    function (error: Error | AxiosError) {
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
