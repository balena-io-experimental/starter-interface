// Import the config.yml file as a JSON object and make it available to other processes as a reactive object.
import { expressApi } from 'boot/axios'
import { reactive } from 'vue'
import { boot } from 'quasar/wrappers'

interface ymlConfig {
  captive_portal: { welcome_page: boolean }
  pages: {
    [index: string]: {
      frames: {
        [index: string]: {
          components: Array<string>
          rows: boolean
          title: string
        }
      }
      icon: string
      label: string
      path: string
    }
  }
  styles: {
    header: {
      language_selector: boolean
      reboot_icon: boolean
      shutdown_icon: boolean
      title: string
      visible: boolean
    }
  }
}

const configYml = reactive(
  JSON.parse(process.env.CONFIG_YML as string)
) as ymlConfig

export default boot(async () => {
  if (process.env.LIVE_CONFIG) {
    try {
      const response = await expressApi.get('/v1/system/config_yml', {
        timeout: 2000
      })

      // Update the reactive object with the new data. Adds `message` if no config.yml file found.
      Object.assign(configYml, response.data as ymlConfig)
    } catch (error) {
      console.error('Failed processing yml config file. Trying to continue.')
      console.error(error)
    }
  }
})

export { configYml }
