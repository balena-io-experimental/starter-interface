<template>{{ data }}</template>

<script lang="ts">
import { getSdk } from 'src/api/balenaSdk'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ToolsSystemInfo',
  setup() {
    const data = ref()

    // Get the SDK object
    const sdk = getSdk()

    async function getFromSdk() {
      await sdk.auth.loginWithToken('token-here')
      data.value = await sdk.models.device.get('apikey-here')
    }

    void getFromSdk()

    return {
      data
    }
  }
})
</script>
