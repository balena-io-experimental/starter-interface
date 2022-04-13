import axios, { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

const expressApi = axios.create({
  timeout: 60000 // Sets a high timeout unlikely to be reached. More specifc timeouts are set in the ExpressJS backend.
})

export { expressApi }
