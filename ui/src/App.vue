<template>
  <div v-if="$q.platform.is.electron || quasarMode == 'pwa'">
    <app-portal />
  </div>
  <div v-else-if="currentPage == '#/captiveportal'">
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
    const quasarMode = ref(process.env.MODE)

    // Show loading indicator as early as possible in loading process.
    // Is disabled by the router afterEach function in router/index.ts
    $q.loading.show()

    // Get the current page path to check if this is a captive portal
    const currentPage = window.location.hash

    return { currentPage, quasarMode }
  }
})
</script>
