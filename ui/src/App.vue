<template>
  <div v-if="currentPage == '#/captiveportal'"><captive-portal /></div>
  <router-view v-else />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import CaptivePortal from 'components/layouts/CaptivePortal.vue'

export default defineComponent({
  name: 'App',
  components: { CaptivePortal },
  setup() {
    const currentPage = location.hash
    return { currentPage }
  }
})
</script>
