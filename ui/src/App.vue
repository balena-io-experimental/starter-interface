<template>
  <div v-if="currentPage == '#/captiveportal'"><captive-portal /></div>
  <router-view v-else />
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    CaptivePortal: defineAsyncComponent(
      () => import('components/layouts/CaptivePortal.vue')
    )
  },
  setup() {
    const currentPage = location.hash
    return { currentPage }
  }
})
</script>
