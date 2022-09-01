// Pinia store actions to call on first boot
import { Platform } from 'quasar'
import { networkSettings } from 'stores/system'

const systemStore = networkSettings()

// Get internet status. Error handling is done in the store.
// Not using store for Electron state to avoid race condition
const currentUrl = new URL(window.location.href)
if (
  (!Platform.is.electron && process.env.MODE !== 'pwa') ||
  (Platform.is.electron &&
    currentUrl.hostname !== 'localhost' &&
    currentUrl.protocol !== 'file:')
) {
  void systemStore.checkInternetStatus()
}
