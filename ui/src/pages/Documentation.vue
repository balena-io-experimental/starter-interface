<template>
  <q-page class="row items-center justify-evenly">
    {{ docs }}
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const docs = ref<string>('Documentation')
    return { docs }
  }
})
</script>
