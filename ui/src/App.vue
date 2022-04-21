<template>
  <div v-if="currentPage == '#/captiveportal'">
    <captive-portal />
  </div>
  <router-view v-else />
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    CaptivePortal: defineAsyncComponent(
      () => import('layouts/CaptivePortal.vue')
    )
  },
  setup() {
    const $q = useQuasar()

    // Show loading indicator as early as possible in loading process.
    // Is disabled by the router afterEach function in router/index.ts
    $q.loading.show()

    // Get the current page path to check if this is a captive portal
    const currentPage = window.location.hash

    return { currentPage }
  }
})
</script>
