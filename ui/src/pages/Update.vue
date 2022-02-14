<template>
  <q-page class="row items-center justify-evenly">
    <update-device />
  </q-page>
</template>

<script lang="ts">
import UpdateDevice from 'src/components/UpdateDevice.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IntUpdate',
  components: { UpdateDevice },
  setup() {
    return {};
  },
});
</script>
