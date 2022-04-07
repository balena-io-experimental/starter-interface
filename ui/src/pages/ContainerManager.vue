<template>
  <q-page class="q-pa-lg">
    <component-frame :components="[{ component: ContainerManager }]" />
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'layouts/ComponentFrame.vue'
import ContainerManager from 'components/ToolsContainerManager.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContainerManagerPage',
  components: { ComponentFrame },
  setup() {
    return { ContainerManager }
  }
})
</script>
