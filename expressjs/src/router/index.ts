import axios, { AxiosError } from 'axios'
import Logger from '../common/logger'

// Axios interceptor
axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error: Error | AxiosError) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Logger.error(`Axios returned status code: ${error.response.status}`)
        Logger.error(error.response.data)
        Logger.error(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        Logger.error(`Axios received no response: ${error.request}`)
      } else {
        // Something happened in setting up the request that triggered an Error
        Logger.error(`Error setting up the Axios request: ${error.message}`)
      }
      // Reject with UI Axios error
      return Promise.reject(error)
    } else {
      // Display an error message
      Logger.error('Unknown Axios error')
      return Promise.reject(error)
    }
  }
)
