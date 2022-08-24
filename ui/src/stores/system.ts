import { expressApi } from 'boot/axios'
import { defineStore } from 'pinia'

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
          `${apiPathV1}/internet_check`,
          { timeout: 3000 }
        )
        this.internetConnectivity = response.data.internet
        return Promise.resolve()
      } catch (error) {
        console.error('Failed fetching internet status.')
        console.error(error)
        this.internetConnectivity = false
        return Promise.reject(error)
      }
    }
  }
})

export const axiosUrl = defineStore('axiosUrl', {
  state: () => ({ axiosBaseUrl: '' }),
  actions: {
    setUrl(newUrl: string) {
      this.axiosBaseUrl = newUrl
    }
  }
})
