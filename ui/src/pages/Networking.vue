<template>
  <q-page class="row items-center justify-evenly">
    <wifi-connect />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WifiConnect from 'src/components/WifiConnect.vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { WifiConnect },
  setup () {
    return {}
  }
})
</script>
