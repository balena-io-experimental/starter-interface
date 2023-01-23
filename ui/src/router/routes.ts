import { configYml } from 'src/boot/ymlImport'
import { RouteRecordRaw } from 'vue-router'

const vuePages = import.meta.glob('pages/*.vue')

// For each item in configYml.sideDrawer create an object
const ymlRoutes = Object.entries(configYml.pages).map((ymlArray) => ({
  name: ymlArray[0],
  component: vuePages[`../pages/${ymlArray[0]}.vue`],
  path: ymlArray[1].path
}))

ymlRoutes.forEach((item, i) => {
  if (item.name.toLowerCase() === 'indexpage') ymlRoutes[i].path = ''
})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: ymlRoutes
  },

  // Always leave this as last one, or remove it entirely
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/layouts/ErrorNotFound.vue')
  }
]

export default routes
