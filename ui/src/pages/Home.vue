<template>
  <q-page class="q-pa-lg">
    <div v-if="internetConnectivity.status">
      <device-info />
    </div>
    <div v-if="internetConnectivity.status == false">
      <offline-device-info />
    </div>
  </q-page>
</template>

<script lang="ts">
import DeviceInfo from 'components/system/DeviceInfo.vue'
import OfflineDeviceInfo from 'components/system/OfflineDeviceInfo.vue'
import { internetConnectivity } from 'src/api/SystemRequests'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { DeviceInfo, OfflineDeviceInfo },
  setup() {
    return { internetConnectivity }
  }
})
</script>
