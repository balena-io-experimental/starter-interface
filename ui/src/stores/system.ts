import { expressApi } from 'boot/axios'
import { defineStore } from 'pinia'

interface cloudlinkConnection {
  loggedIn: boolean
}

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
    isCloudlink: undefined as boolean | undefined
  }),

  actions: {
    async checkCloudlink() {
      try {
        const response = await expressApi.get<cloudlinkConnection>(
          '/v1/sdk/loggedIn',
          { timeout: 15000 }
        )
        this.isCloudlink = response.data.loggedIn
        return Promise.resolve()
      } catch (error) {
        console.error('Failed fetching Cloudlink status.')
        console.error(error)
        this.isCloudlink = false
        return Promise.reject(error)
      }
    }
  }
})
