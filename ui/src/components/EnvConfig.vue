<template>
  <div v-if="getEnvResponse">
    <div class="q-mt-none q-mb-lg">
      <q-table
        flat
        bordered
        separator="cell"
        :title="$t('deviceInfo.environment_variables')"
        :rows="getEnvResponse.data"
        :columns="columns"
        row-key="name"
      />
    </div>
    <q-expansion-item
      expand-separator
      icon="code"
      :label="$t('deviceInfo.response_details')"
      :caption="$t('deviceInfo.raw_json')"
    >
      <pre>{{ getEnvResponse.data }}</pre>
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
    const columns = [
      {
        name: 'name',
        style: 'width: 200px',
        align: 'left',
        label: 'Name',
        field: 'name',
        sortable: true
      },
      {
        name: 'value',
        align: 'left',
        label: 'Value',
        field: 'value',
        sortable: true
      }
    ]

    const rows = ref()
    const getEnvResponse = ref<AxiosResponse>()

    async function getEnv() {
      getEnvResponse.value = await sdkRequests.getEnv()
      rows.value = getEnvResponse.value
    }

    onMounted(async () => {
      await getEnv()
    })

    return {
      getEnvResponse,
      columns
    }
  }
})
</script>
