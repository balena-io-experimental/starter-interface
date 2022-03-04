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
  <div v-if="loading">
    <q-spinner color="primary" size="3em" />
  </div>
</template>

<script lang="ts">
import { sdkRequests } from 'src/api/SdkRequests'
import { AxiosError, AxiosResponse } from 'axios'
import { QTableProps } from 'quasar'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'EnvConfigComponent',

  setup() {
    const columns: QTableProps['columns'] = [
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

    const loading = ref<boolean>(true)
    const rows = ref()
    const getEnvResponse = ref<AxiosResponse>()

    async function getEnv() {
      getEnvResponse.value = await sdkRequests.getEnv()
      rows.value = getEnvResponse.value
    }

    onMounted(async () => {
      await getEnv().catch(function (error: Error | AxiosError) {
        console.log(error)
      })
      loading.value = false
    })

    return {
      loading,
      getEnvResponse,
      columns
    }
  }
})
</script>
