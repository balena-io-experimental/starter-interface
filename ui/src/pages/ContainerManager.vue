<template>
  <q-page class="q-pa-lg">
    <component-frame :components="[{ component: ContainerManager }]" />
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'src/components/layouts/ComponentFrame.vue'
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
