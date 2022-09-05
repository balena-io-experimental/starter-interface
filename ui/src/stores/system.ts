import { expressApi } from 'boot/axios'
import { defineStore } from 'pinia'

interface internetConnection {
  internet: boolean
}

const apiPathV1 = 'v1/system' as string

export const axiosSettings = defineStore('axiosSettings', {
  state: () => ({ axiosBaseUrl: '' }),
  actions: {
    setUrl(newUrl: string) {
      this.axiosBaseUrl = newUrl
    }
  }
})

export const networkSettings = defineStore('networkSettings', {
  state: () => ({
    internetConnectivity: undefined as boolean | undefined
  }),

  actions: {
    async checkInternetStatus() {
      try {
        const response = await expressApi.get<internetConnection>(
          `${apiPathV1}/internet_check`,
          { timeout: 15000 }
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
