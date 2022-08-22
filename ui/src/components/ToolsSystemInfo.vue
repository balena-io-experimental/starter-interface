<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        v-model="model"
        filled
        dense
        :loading="isLoadingRequest"
        :options="sysInfoCmds"
        :label="$t('components.tools.system_info.select_request')"
        @update:model-value="getSystemInfo(model)"
      />
    </div>
  </div>
  <q-expansion-item
    expand-separator
    default-opened
    icon="code"
    :label="$t('components.system.device_info.response_details')"
    :caption="$t('components.system.device_info.raw_json')"
  >
    <pre v-if="response" style="white-space: pre-wrap">{{ response.data }}</pre>
  </q-expansion-item>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { expressApi } from 'boot/axios'
import sysInfoCmds from 'src/api/sysInfoCmds'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ToolsSystemInfo',
  setup() {
    const isLoadingRequest = ref<boolean>(false)
    const response = ref<AxiosResponse>()

    async function getSystemInfo(model: { id: string } | null) {
      if (model != null) {
        isLoadingRequest.value = true
        try {
          const res = await expressApi.post('/v1/system/systeminfo', {
            id: model.id
          })

          response.value = res
        } catch {
          isLoadingRequest.value = false
        }
      }
      isLoadingRequest.value = false
    }

    return {
      getSystemInfo,
      isLoadingRequest,
      model: ref(null),
      response,
      sysInfoCmds
    }
  }
})
</script>
