<template>
  <q-page class="q-pa-lg">
    <FileManager />
  </q-page>
</template>

<script lang="ts">
import FileManager from 'components/tools/FileManager.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntFileManager',
  components: { FileManager },
  setup() {
    return {}
  }
})
</script>
