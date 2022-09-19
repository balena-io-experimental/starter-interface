// Pinia store actions to call on first boot
import { networkSettings } from 'stores/system'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  // Get Cloudlink status
  if (process.env.ON_DEVICE?.toLowerCase() === 'true') {
    const networkStore = networkSettings()
    void networkStore.checkCloudlink()
  }
})
