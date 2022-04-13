import { defineStore } from 'pinia'
import expressApi from 'axios'

interface internetConnection {
  internet: boolean
}

const apiPathV1 = 'v1/system' as string

export const useSystemStore = defineStore('system', {
  state: () => ({
    internetConnectivity: undefined as boolean | undefined
  }),

  actions: {
    async checkInternetStatus() {
      try {
        const response = await expressApi.get<internetConnection>(
          `${apiPathV1}/internet_check`
        )
        this.internetConnectivity = response.data.internet
      } catch (error) {
        console.error('Failed fetching internet status.')
        console.error(error)
        this.internetConnectivity = false
        return Promise.reject(error)
      }
    }
  }
})
