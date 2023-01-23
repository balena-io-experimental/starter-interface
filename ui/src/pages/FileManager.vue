<template>
  <yml-import />
</template>

<script lang="ts">
import YmlImport from 'layouts/YmlImport.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SystemInfo',
  components: { YmlImport },
  setup() {
    return {}
  }
})
</script>
