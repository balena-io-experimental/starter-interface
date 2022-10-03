<template>
  <q-page class="q-pa-lg">
    <component-frame :components="[{ component: ContainerManager }]" />
  </q-page>
</template>

<script lang="ts">
import ContainerManager from 'components/ToolsContainerManager.vue'
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContainerManager',
  components: { ComponentFrame },
  setup() {
    return { ContainerManager }
  }
})
</script>
