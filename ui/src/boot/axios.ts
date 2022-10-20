import axios, { AxiosError } from 'axios'
import { i18n } from 'boot/i18n'
import { Notify } from 'quasar'
import { axiosSettings } from 'stores/system'
import { boot } from 'quasar/wrappers'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = i18n.global

const expressApi = axios.create({
  timeout: 60000 // Sets a high timeout unlikely to be reached. More specific timeouts are set in the ExpressJS backend.
})

export default boot(() => {
  const axiosBaseUrl = axiosSettings()

  // Set the device address to use for backend API requests based on available
  // DEVICE_HOSTNAME environment variable
  if (process.env.DEVICE_HOSTNAME) {
    expressApi.defaults.baseURL = `http://${process.env.DEVICE_HOSTNAME}`
  } else {
    // Generate URL from self
    const currentURL = new URL(window.location.href)
    // Set backend URL to URL currently in browser (including port where applicable)
    expressApi.defaults.baseURL = currentURL.origin
  }

  // Store the default URL in the Pinia store. The Axios instance is not reactive
  // so we use a store instead
  axiosBaseUrl.setUrl(expressApi.defaults.baseURL)

  // Axios request interceptor
  expressApi.interceptors.request.use(
    (config) => {
      // Override the default baseURL based on stored path from electron app
      const currentBaseUrl = axiosBaseUrl.$state.axiosBaseUrl

      if (currentBaseUrl) {
        config.baseURL = currentBaseUrl
      }
      return config
    },
    (error: AxiosError) => {
      if (error && error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        Notify.create({
          type: 'negative',
          message: t('system.errors.request_error')
        })
      }
      // Reject with UI Axios error
      return Promise.reject(error)
    }
  )

  // Axios response interceptor
  expressApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error && error.response) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        Notify.create({
          type: 'negative',
          message: `${t('general.error')}: ${t('system.errors.no_backend')}`
        })
        console.error(`Axios error. Status code: ${error.response.status}`)
      }
      // Reject with UI Axios error
      return Promise.reject(error)
    }
  )
})

export { expressApi }
