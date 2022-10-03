<template>
  <q-page class="q-pa-lg">
    <div class="row justify-end">
      <component-frame :components="[{ component: JournalDLogs }]" />
    </div>

    <div><component-frame :components="[{ component: SystemInfo }]" /></div>
  </q-page>
</template>

<script lang="ts">
import JournalDLogs from 'components/SystemJournalDLogs.vue'
import SystemInfo from 'components/ToolsSystemInfo.vue'
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SystemInfo',
  components: { ComponentFrame },
  setup() {
    return { JournalDLogs, SystemInfo }
  }
})
</script>
