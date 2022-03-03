<template>
  <q-page class="q-pa-lg">
    <system-info />
  </q-page>
</template>

<script lang="ts">
import SystemInfo from 'src/components/SystemInfo.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { SystemInfo },
  setup() {
    return {}
  }
})
</script>
