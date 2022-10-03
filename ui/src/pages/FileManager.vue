<template>
  <q-page>
    <div><component-frame :components="[{ component: FileManager }]" /></div>
  </q-page>
</template>

<script lang="ts">
import FileManager from 'components/ToolsFileManager.vue'
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FileManager',
  components: { ComponentFrame },
  setup() {
    return { FileManager }
  }
})
</script>
