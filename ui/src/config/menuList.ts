import { i18n } from 'boot/i18n'
import { computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = i18n.global

export default computed(() => [
  {
    icon: 'visibility',
    label: t('system.menu_items.device_info'),
    path: 'home'
  },
  {
    icon: 'all_inbox',
    label: t('system.menu_items.container_manager'),
    path: 'containermanager'
  },
  {
    icon: 'folder',
    label: t('system.menu_items.file_manager'),
    path: 'filemanager'
  },
  {
    icon: 'router',
    label: t('system.menu_items.networking'),
    path: 'networking'
  },
  {
    icon: 'settings',
    label: t('system.menu_items.configuration'),
    path: 'configuration'
  },
  {
    icon: 'info',
    label: t('system.menu_items.system_info'),
    path: 'systeminfo'
  }
])
