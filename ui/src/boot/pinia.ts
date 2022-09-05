// Pinia store actions to call on first boot
import { networkSettings } from 'stores/system'

const systemStore = networkSettings()

// Get internet status. Error handling is done in the store.
if (process.env.ON_DEVICE?.toLowerCase() === 'true') {
  void systemStore.checkInternetStatus()
}
