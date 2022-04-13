// Pinia store actions to call on first boot
import { useSystemStore } from 'stores/system'

const systemStore = useSystemStore()

// Get internet status. Error handling is done in the store.
void systemStore.checkInternetStatus()
