<template>
  <div class="row">
    <q-btn
      :loading="loading"
      v-bind="qBtnStyle"
      :label="$t('components.system.journal_d_logs.fetch_journald')"
      @click="fetchLogs()"
    />
  </div>
</template>

<script lang="ts">
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { AxiosResponse } from 'axios'
import { exportFile } from 'quasar'
import { qBtnStyle } from 'components/styles/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntJournalD',
  setup() {
    const loading = ref<boolean>(false)
    const response = ref<AxiosResponse>()

    async function fetchLogs() {
      loading.value = true
      response.value = await supervisorRequests.journald_logs()
      loading.value = false

      exportFile('journald-logs.txt', response.value.data as string)
    }
    return {
      fetchLogs,
      loading,
      qBtnStyle
    }
  }
})
</script>
