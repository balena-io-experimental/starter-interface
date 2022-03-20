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
import { internetConnectivity } from 'src/api/SystemRequests'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: {
    DeviceInfo: defineAsyncComponent(
      () => import('components/system/DeviceInfo.vue')
    ),
    OfflineDeviceInfo: defineAsyncComponent(
      () => import('components/system/OfflineDeviceInfo.vue')
    )
  },
  setup() {
    return { internetConnectivity }
  }
})
</script>
