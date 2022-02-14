<template>
  <q-page class="row items-center justify-evenly">
    <wifi-connect />
  </q-page>
</template>

<script lang="ts">
import WifiConnect from 'src/components/WifiConnect.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IntPageIndex',
  components: { WifiConnect },
  setup() {
    return {};
  },
});
</script>
