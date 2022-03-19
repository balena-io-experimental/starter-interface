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

  Router.beforeResolve((_to, _from, next) => {
    // Show the loading indicator on a page change.
    Loading.show({
      delay: 300 // ms
    })
    next()
  })

  Router.afterEach(() => {
    // Complete the animation of the loading indicator after page change.
    Loading.hide()
  })

  // Set default baseURL
  expressApi.defaults.baseURL = process.env.ExpressAPI

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
          message: i18n.global.t('general.request_error')
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
          message: `${i18n.global.t('general.Error')}: ${error.response.status}`
        })
      }
      // Reject with UI Axios error
      return Promise.reject(error)
    }
  )

  return Router
})
