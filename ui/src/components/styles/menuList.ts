/* eslint-disable @typescript-eslint/no-unsafe-call */
import { i18n } from '../../boot/i18n'
import { computed } from 'vue'

export default computed(() => [
  {
    icon: 'visibility',
    label: i18n.global.t('titles.Device_Info'),
    path: 'home'
  },
  {
    icon: 'folder',
    label: i18n.global.t('titles.VolumeManager'),
    path: 'filemanager'
  },
  {
    icon: 'router',
    label: i18n.global.t('titles.Networking'),
    path: 'networking'
  },
  {
    icon: 'settings',
    label: i18n.global.t('titles.Configuration'),
    path: 'configuration'
  },
  {
    icon: 'info',
    label: i18n.global.t('titles.System_Info'),
    path: 'systeminfo'
  }
])
