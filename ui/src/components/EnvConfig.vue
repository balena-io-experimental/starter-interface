<template>
  <div v-if="getEnvResponse">
    <q-expansion-item
      expand-separator
      icon="code"
      :label="$t('response_details')"
      :caption="$t('raw_json')"
    >
      <pre>{{ getEnvResponse }}</pre>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { sdkRequests } from '../api/SdkRequests'
import { AxiosResponse } from 'axios'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'EnvConfigComponent',
  
  setup() {
    const getEnvResponse = ref<AxiosResponse>()

    async function getEnv() {
      getEnvResponse.value = await sdkRequests.getEnv()
    }

    onMounted(async () => {
      await getEnv()
    })

    return {
      getEnvResponse
    }
  }
})
</script>
