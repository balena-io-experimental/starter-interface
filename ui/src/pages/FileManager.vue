<template>
  <q-page>
    <div><component-frame :components="[FileManager]" /></div>
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'src/components/styles/ComponentFrame.vue'
import FileManager from 'components/tools/FileManager.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntFileManager',
  components: { ComponentFrame },
  setup() {
    return { FileManager }
  }
})
</script>
