import { i18n } from 'boot/i18n'
import { computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = i18n.global

// List of menu items to display in left hand navigation bar
export default computed(() => [
  {
    icon: 'visibility',
    label: t('system.menu_items.device_info'),
    path: 'indexPage'
  },
  {
    icon: 'all_inbox',
    label: t('system.menu_items.container_manager'),
    path: 'containerManager'
  },
  {
    icon: 'folder',
    label: t('system.menu_items.file_manager'),
    path: 'fileManager'
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
    path: 'systemInfo'
  }
])
