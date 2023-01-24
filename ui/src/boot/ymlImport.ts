// Import the config.yml file as a JSON object and make it available to other processes as a reactive object.
import { expressApi } from 'boot/axios'
import { reactive } from 'vue'
import { boot } from 'quasar/wrappers'

interface ymlConfig {
  styles: { header: { visible: boolean; title: string } }
  pages: {
    [index: string]: {
      components: Array<Array<string>>
      icon: string
      label: string
      path: string
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
