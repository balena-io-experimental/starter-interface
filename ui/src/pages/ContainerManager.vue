<template>
  <q-page class="q-pa-lg">
    <container-manager />
  </q-page>
</template>

<script lang="ts">
import ContainerManager from 'components/tools/ContainerManager.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntContainerManager',
  components: { ContainerManager },
  setup() {
    return {}
  }
})
</script>
