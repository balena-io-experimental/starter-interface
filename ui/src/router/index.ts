import axios, { AxiosError } from 'axios'
import expressApi from 'axios'
import { i18n } from 'boot/i18n'
import { Notify } from 'quasar'
import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      // eslint-disable-next-line no-void
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    )
  })

  // Set Axios express default url for development environment
  expressApi.defaults.baseURL = process.env.DEV
    ? 'http://localhost/'
    : undefined

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
          console.log(
            `Error. Axios returned status code: ${error.response.status}`
          )
          console.log(error.response.data)
          console.log(error.response.headers)
          // Notify of 404 errors, resulting from endpoints not being available
          if (error.response.status === 404) {
            Notify.create({
              type: 'negative',
              message: '404'
            })
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('Axios received no response.')
          console.log(error.request)
          // Display an error message
          Notify.create({
            type: 'negative',
            message: i18n.global.t('general.request_error')
          })
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Unknown Axios error.')
          console.log(error.message)
          // Display an error message
          Notify.create({
            type: 'negative',
            message: `${i18n.global.t('general.Error')}: ${error.message}`
          })
        }
        // Reject with UI Axios error
        return Promise.reject(error)
      } else {
        console.log(error)
        // Display an error message
        Notify.create({
          type: 'negative',
          message: i18n.global.t('general.Error')
        })
        return Promise.reject(error)
      }
    }
  )
  return Router
})
