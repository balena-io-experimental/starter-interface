import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'indexPage'
      },
      {
        path: 'configuration',
        component: () => import('pages/Configuration.vue'),
        name: 'configuration'
      },
      {
        path: 'filemanager',
        component: () => import('pages/FileManager.vue'),
        name: 'fileManager'
      },
      {
        path: 'containermanager',
        component: () => import('pages/ContainerManager.vue'),
        name: 'containerManager'
      },
      {
        path: 'networking',
        component: () => import('pages/Networking.vue'),
        name: 'networking'
      },
      {
        path: 'systeminfo',
        component: () => import('pages/SystemInfo.vue'),
        name: 'systemInfo'
      }
    ]
  },

  // Always leave this as last one, or remove it entirely
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue')
  }
]

export default routes
