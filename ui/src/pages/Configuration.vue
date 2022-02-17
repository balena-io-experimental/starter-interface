<template>
  <q-page class="q-pa-lg">
    <h5 class="q-mt-none q-mb-lg">{{ $t('environment_variables') }}</h5>
    <env-config />
    <h5>{{ $t('supervisor_config') }}</h5>
    <change-hostname />
    <ping-supervisor />
  </q-page>
</template>

<script lang="ts">
import EnvConfig from 'src/components/EnvConfig.vue'
import ChangeHostname from 'src/components/ChangeHostname.vue'
import PingSupervisor from 'src/components/PingSupervisor.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { ChangeHostname, PingSupervisor, EnvConfig },
  setup() {
    return {}
  }
})
</script>
