import expressApi from 'axios'
import { i18n } from 'boot/i18n'
import { Loading, Notify } from 'quasar'
import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from './routes'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = i18n.global

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { left: 0, top: 0 }
      }
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.afterEach(() => {
    // Complete the animation of the loading indicator after page change.
    Loading.hide()
  })

  if (process.env.BACKEND_PORT) {
    expressApi.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}:${process.env.BACKEND_PORT}`
  } else if (!process.env.ON_DEVICE) {
    expressApi.defaults.baseURL = `${window.location.protocol}//${window.location.hostname}`
  }

  // Axios request interceptor
  expressApi.interceptors.request.use(
    function (config) {
      return config
    },
    function (error: Error) {
      if (expressApi.isAxiosError(error) && error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        Notify.create({
          type: 'negative',
          message: t('general.request_error')
        })
      }
      // Reject with UI Axios error
      return Promise.reject(error)
    }
  )

  // Axios response interceptor
  expressApi.interceptors.response.use(
    function (response) {
      return response
    },
    function (error: Error) {
      if (expressApi.isAxiosError(error) && error.response) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        Notify.create({
          type: 'negative',
          message: `${t('general.error')}: ${error.response.status}`
        })
      }
      // Reject with UI Axios error
      return Promise.reject(error)
    }
  )

  return Router
})
