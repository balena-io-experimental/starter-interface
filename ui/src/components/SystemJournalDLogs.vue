<template>
  <div class="row">
    <q-space />
    <q-btn
      :loading="isLoading"
      v-bind="qBtnStyle"
      :label="$t('components.system.journal_d_logs.fetch_journald')"
      @click="fetchLogs()"
    />
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { exportFile } from 'quasar'
import { supervisor } from 'src/api/supervisor'
import { qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SystemJournalDLogs',
  setup() {
    const isLoading = ref<boolean>(false)
    const response = ref<AxiosResponse>()

    async function fetchLogs() {
      isLoading.value = true
      response.value = await supervisor.v2.journald_logs()
      isLoading.value = false

      exportFile('journald-logs.txt', response.value.data as string)
    }
    return {
      fetchLogs,
      isLoading,
      qBtnStyle
    }
  }
})
</script>
