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

export default route((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const router = createRouter({
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { left: 0, top: 0 }
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  router.afterEach(() => {
    // Complete the animation of the loading indicator after page change.
    Loading.hide()
  })

  // Handle the start up state to ensure the backend is always reachable when on a different port or hostname
  if (process.env.DEVICE_HOSTNAME) {
    expressApi.defaults.baseURL = `http://${process.env.DEVICE_HOSTNAME}`
  } else {
    // Generate URL from self
    const currentURL = new URL(window.location.href)
    // Set backend URL to URL currently in browser (including port where applicable)
    expressApi.defaults.baseURL = currentURL.origin
  }

  // Axios request interceptor
  expressApi.interceptors.request.use(
    (config) => config,
    (error: Error) => {
      if (expressApi.isAxiosError(error) && error.request) {
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
    (error: Error) => {
      if (expressApi.isAxiosError(error) && error.response) {
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

  return router
})
