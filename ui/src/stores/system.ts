import { expressApi } from 'boot/axios'
import { defineStore } from 'pinia'
import { Platform } from 'quasar'

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

// `electronSettings` store:
// null = not Electron
// true = Electron main page
// false = Loaded in Electron but pointing to a page it redirect too away from it's embedded pages
export const electronSettings = defineStore('electronSettings', {
  state: () => {
    let electronPage = null

    // If it's not an electron page return null
    if (!Platform.is.electron) {
      return { electronPage }
    }

    // It's an electron page, is it localhost (i.e. the core page, not a redirect)?
    if (new URL(window.location.href).hostname === 'localhost') {
      electronPage = true
      return { electronPage }
    }

    // It's electron but not localhost
    electronPage = false
    return {
      electronPage
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
