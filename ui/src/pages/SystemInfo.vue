<template>
  <q-page class="q-pa-lg">
    <div class="row justify-end">
      <component-frame :components="[{ component: JournalDLogs }]" />
    </div>

    <div><component-frame :components="[{ component: SystemInfo }]" /></div>
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'src/components/layouts/ComponentFrame.vue'
import JournalDLogs from 'components/system/JournalDLogs.vue'
import SystemInfo from 'components/tools/SystemInfo.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntSystemInfo',
  components: { ComponentFrame },
  setup() {
    return { ComponentFrame, JournalDLogs, SystemInfo }
  }
})
</script>
