/* eslint-disable @typescript-eslint/no-unsafe-call */
import { i18n } from 'boot/i18n'
import { computed } from 'vue'

export default computed(() => [
  {
    icon: 'visibility',
    label: i18n.global.t('menu_items.Device_Info'),
    path: 'home'
  },
  {
    icon: 'all_inbox',
    label: i18n.global.t('menu_items.container_manager'),
    path: 'containermanager'
  },
  {
    icon: 'folder',
    label: i18n.global.t('menu_items.volume_manager'),
    path: 'filemanager'
  },
  {
    icon: 'router',
    label: i18n.global.t('menu_items.Networking'),
    path: 'networking'
  },
  {
    icon: 'settings',
    label: i18n.global.t('menu_items.Configuration'),
    path: 'configuration'
  },
  {
    icon: 'info',
    label: i18n.global.t('menu_items.System_Info'),
    path: 'systeminfo'
  }
])
