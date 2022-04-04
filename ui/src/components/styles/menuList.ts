/* eslint-disable @typescript-eslint/no-unsafe-call */
import { i18n } from 'boot/i18n'
import { computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = i18n.global

export default computed(() => [
  {
    icon: 'visibility',
    label: t('menu_items.device_info'),
    path: 'home'
  },
  {
    icon: 'all_inbox',
    label: t('menu_items.container_manager'),
    path: 'containermanager'
  },
  {
    icon: 'folder',
    label: t('menu_items.volume_manager'),
    path: 'filemanager'
  },
  {
    icon: 'router',
    label: t('menu_items.networking'),
    path: 'networking'
  },
  {
    icon: 'settings',
    label: t('menu_items.configuration'),
    path: 'configuration'
  },
  {
    icon: 'info',
    label: t('menu_items.system_info'),
    path: 'systeminfo'
  }
])
