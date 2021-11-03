import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue'), name: 'home' },
      { path: 'documentation', component: () => import('pages/Documentation.vue'), name: 'documentation' },
      { path: 'settings', component: () => import('pages/Settings.vue'), name: 'settings' },
      { path: 'update', component: () => import('pages/Update.vue'), name: 'update' }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
