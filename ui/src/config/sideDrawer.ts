import { i18n } from 'boot/i18n'
import { configYml } from 'src/boot/ymlImport'
import { computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = i18n.global

// For each item page in config yml file, create an object
const sideDrawerItems = Object.entries(configYml.pages).map((ymlArray) => ({
  icon: ymlArray[1].icon,
  label: t(ymlArray[1].label),
  path: ymlArray[0]
}))

// List of menu items to display in left hand navigation bar
export default computed(() => sideDrawerItems)
