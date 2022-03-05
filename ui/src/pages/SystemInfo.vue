<template>
  <q-page class="q-pa-lg">
    <div class="row">
      <q-space />
      <journal-d-logs />
    </div>
    <div><system-info /></div>
  </q-page>
</template>

<script lang="ts">
import JournalDLogs from 'components/system/JournalDLogs.vue'
import SystemInfo from 'components/tools/SystemInfo.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntSystemInfo',
  components: { JournalDLogs, SystemInfo },
  setup() {
    return {}
  }
})
</script>
