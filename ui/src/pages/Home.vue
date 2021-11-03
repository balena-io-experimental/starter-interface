<template>
  <q-page class="row items-center justify-evenly">
    {{ homepage }}
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const homepage = ref<string>('Homepage')
    return { homepage }
  }
})
</script>
