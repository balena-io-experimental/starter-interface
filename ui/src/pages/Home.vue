<template>
  <q-page class="q-pa-lg">
    <device-info />
  </q-page>
</template>

<script lang="ts">
import DeviceInfo from 'src/components/DeviceInfo.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { DeviceInfo },
  setup () {
    const homepage = ref<string>('Homepage')
    return { homepage }
  }
})
</script>
