<template>
  <q-page class="q-pa-lg">
    <div v-if="internetConnectivity.status">
      <component-frame :components="[{ component: DeviceInfo }]" />
    </div>
    <div v-if="internetConnectivity.status == false">
      <component-frame :components="[{ component: OfflineDeviceInfo }]" />
    </div>
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { internetConnectivity } from 'src/api/system'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    ComponentFrame
  },
  setup() {
    return {
      internetConnectivity,
      DeviceInfo: defineAsyncComponent(
        () => import('src/components/SystemDeviceInfo.vue')
      ),
      OfflineDeviceInfo: defineAsyncComponent(
        () => import('src/components/SystemOfflineDeviceInfo.vue')
      )
    }
  }
})
</script>
