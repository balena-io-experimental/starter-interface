// Pinia store actions to call on first boot
import { networkSettings } from 'stores/system'

const networkStore = networkSettings()

// Get Cloudlink status
if (process.env.ON_DEVICE?.toLowerCase() === 'true') {
  void networkStore.checkCloudlink()
}
