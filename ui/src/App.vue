<template>
  <div v-if="$q.platform.is.electron && !onDevice">
    <electron-layout />
  </div>
  <div v-else-if="currentURL.hash == '#/captiveportal'">
    <captive-portal />
  </div>
  <div v-else-if="quasarMode == 'pwa'">
    <pwa-layout />
  </div>
  <router-view v-else />
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineAsyncComponent, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    CaptivePortal: defineAsyncComponent(
      () => import('layouts/CaptivePortal.vue')
    ),
    ElectronLayout: defineAsyncComponent(
      () => import('layouts/ElectronLayout.vue')
    ),
    PwaLayout: defineAsyncComponent(() => import('layouts/PwaLayout.vue'))
  },
  setup() {
    const $q = useQuasar()

    const currentURL = new URL(window.location.href)
    const onDevice = ref(process.env.ON_DEVICE?.toLowerCase() === 'true')
    const quasarMode = ref(process.env.MODE)

    // Show loading indicator as early as possible in loading process.
    // Is disabled by the router afterEach function in router/index.ts
    $q.loading.show()

    return { currentURL, onDevice, quasarMode }
  }
})
</script>
