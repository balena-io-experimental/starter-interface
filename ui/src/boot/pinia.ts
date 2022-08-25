// Pinia store actions to call on first boot
import { Platform } from 'quasar'
import { useSystemStore } from 'stores/system'

const systemStore = useSystemStore()

// Get internet status. Error handling is done in the store.
if (!Platform.is.electron && process.env.MODE !== 'pwa') {
  void systemStore.checkInternetStatus()
}
