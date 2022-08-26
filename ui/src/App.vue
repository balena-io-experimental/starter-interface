<template>
  <!-- Not drawing on Store for localhost validation to avoid race condition -->
  <div
    v-if="
      ($q.platform.is.electron && currentURL.hostname == 'localhost') ||
      quasarMode == 'pwa'
    "
  >
    <app-portal />
  </div>
  <div v-else-if="currentURL.hash == '#/captiveportal'">
    <captive-portal />
  </div>
  <router-view v-else />
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineAsyncComponent, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    AppPortal: defineAsyncComponent(() => import('layouts/AppPortal.vue')),
    CaptivePortal: defineAsyncComponent(
      () => import('layouts/CaptivePortal.vue')
    )
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
