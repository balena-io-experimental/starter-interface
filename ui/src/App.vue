<template>
  <div
    v-if="
      $q.platform.is.electron &&
      (currentURL.hostname == 'localhost' || currentURL.protocol == 'file:')
    "
  >
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
    const quasarMode = ref(process.env.MODE)

    // Show loading indicator as early as possible in loading process.
    // Is disabled by the router afterEach function in router/index.ts
    $q.loading.show()

    return { currentURL, quasarMode }
  }
})
</script>
