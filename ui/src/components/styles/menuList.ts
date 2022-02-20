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
    icon: 'settings',
    label: i18n.global.t('titles.Configuration'),
    path: 'configuration'
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
    icon: 'update',
    label: i18n.global.t('titles.Update'),
    path: 'update'
  },
  {
    icon: 'book',
    label: i18n.global.t('titles.Documentation'),
    path: 'documentation'
  }
])
