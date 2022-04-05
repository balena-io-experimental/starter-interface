<template>
  <q-page class="q-pa-lg">
    <div v-if="internetConnectivity.status">
      <component-frame :components="[DeviceInfo]" />
    </div>
    <div v-if="internetConnectivity.status == false">
      <component-frame :components="[OfflineDeviceInfo]" />
    </div>
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'src/components/styles/ComponentFrame.vue'
import { internetConnectivity } from 'src/api/SystemRequests'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: {
    ComponentFrame
  },
  setup() {
    return {
      internetConnectivity,
      DeviceInfo: defineAsyncComponent(
        () => import('components/system/DeviceInfo.vue')
      ),
      OfflineDeviceInfo: defineAsyncComponent(
        () => import('components/system/OfflineDeviceInfo.vue')
      )
    }
  }
})
</script>
