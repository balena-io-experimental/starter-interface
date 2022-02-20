<template>
  <q-page class="q-pa-lg">
    <filemanager />
  </q-page>
</template>

<script lang="ts">
import Filemanager from 'src/components/Filemanager.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { Filemanager },
  setup() {
    return {}
  }
})
</script>
