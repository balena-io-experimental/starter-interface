<template>
  <q-page class="q-pa-lg">
    <component-frame :components="[ContainerManager]" />
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'src/components/styles/ComponentFrame.vue'
import ContainerManager from 'components/tools/ContainerManager.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntContainerManager',
  components: { ComponentFrame },
  setup() {
    return { ContainerManager }
  }
})
</script>
