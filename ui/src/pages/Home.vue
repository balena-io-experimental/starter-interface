<template>
  <q-page class="q-pa-lg">
    <device-info />
  </q-page>
</template>

<script lang="ts">
import DeviceInfo from 'components/system/DeviceInfo.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { DeviceInfo },
  setup() {
    return {}
  }
})
</script>
