// Pinia store actions to call on first boot
import { Platform } from 'quasar'
import { networkSettings } from 'stores/system'

const systemStore = networkSettings()

// Get internet status. Error handling is done in the store.
// Not using store for Electron state to avoid race conditon
if (
  (!Platform.is.electron && process.env.MODE !== 'pwa') ||
  (Platform.is.electron &&
    new URL(window.location.href).hostname !== 'localhost')
) {
  void systemStore.checkInternetStatus()
}
