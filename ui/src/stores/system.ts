import { expressApi } from 'boot/axios'
import { defineStore } from 'pinia'

interface CloudlinkConnectionRes {
  loggedIn: boolean
}

// Store Axios settings in Pinia store as they are not reactive within the Axios instance.
export const axiosSettings = defineStore('axiosSettings', {
  state: () => ({ axiosBaseUrl: '' }),
  actions: {
    setUrl(newUrl: string) {
      this.axiosBaseUrl = newUrl
    }
  }
})

// Store Cloudlink status and allow retesting
export const networkSettings = defineStore('networkSettings', {
  state: () => ({
    isCloudlink: undefined as boolean | undefined
  }),

  actions: {
    async checkCloudlink() {
      try {
        const response = await expressApi.get<CloudlinkConnectionRes>(
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
