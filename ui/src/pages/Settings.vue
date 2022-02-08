<template>
  <q-page class="row text-center items-center justify-evenly">
    <div>
      <change-hostname />
      <ping-supervisor />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChangeHostname from 'src/components/ChangeHostname.vue'
import PingSupervisor from 'src/components/PingSupervisor.vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { ChangeHostname, PingSupervisor },
  setup () {
    return {}
  }
})
</script>
