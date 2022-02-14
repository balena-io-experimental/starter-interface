/* eslint-disable @typescript-eslint/no-unsafe-call */
import { i18n } from '../../boot/i18n'
import { computed } from 'vue'

export default computed(() => [
  {
    icon: 'visibility',
    label: i18n.global.t('Device_Info'),
    path: 'home'
  },
  {
    icon: 'book',
    label: i18n.global.t('Documentation'),
    path: 'documentation'
  },
  {
    icon: 'router',
    label: i18n.global.t('Networking'),
    path: 'networking'
  },
  {
    icon: 'update',
    label: i18n.global.t('Update'),
    path: 'update'
  },
  {
    icon: 'settings',
    label: i18n.global.t('Settings'),
    path: 'settings'
  }
])
