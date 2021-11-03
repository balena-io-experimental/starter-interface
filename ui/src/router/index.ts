import axios from 'axios'
import { i18n } from '../boot/i18n'
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
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

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

  // Axios interceptor
  axios.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    // Display the Backend Axios error
    console.log(error.response.data)

    // Display an error message
    Notify.create({
      type: 'negative',
      message: `${i18n.global.t('error')} ${error.message as string}`
    })
    // Reject with UI axios error
    return Promise.reject(error)
  })
  return Router
})
