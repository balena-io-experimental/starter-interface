<template>
  <q-page class="q-pa-lg">
    <div v-if="systemStore.internetConnectivity">
      <component-frame :components="[{ component: DeviceInfo }]" />
    </div>
    <div v-if="systemStore.internetConnectivity == false">
      <component-frame :components="[{ component: OfflineDeviceInfo }]" />
    </div>
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { useSystemStore } from 'stores/system'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    ComponentFrame
  },
  setup() {
    const systemStore = useSystemStore()

    return {
      systemStore,
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
