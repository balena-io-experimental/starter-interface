<template>
  <q-page class="q-pa-lg">
    <component-frame :components="[{ component: DeviceInfo }]" />
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    ComponentFrame
  },
  setup() {
    return {
      DeviceInfo: defineAsyncComponent(
        () => import('src/components/SystemDeviceInfo.vue')
      )
    }
  }
})
</script>
