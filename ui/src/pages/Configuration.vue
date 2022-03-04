<template>
  <q-page class="q-pa-lg">
    <env-config />
    <div class="text-h5 q-mb-lg q-mt-lg">{{ $t('supervisor_config') }}</div>
    <change-hostname />

    <q-list bordered class="rounded-borders q-mt-md">
      <q-item-label header>{{ $t('system.Services') }}</q-item-label>

      <q-item>
        <q-item-section avatar>
          <q-icon name="network_ping" />
        </q-item-section>

        <q-item-section>
          <div><ping-supervisor /></div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-icon name="update" />
        </q-item-section>

        <q-item-section>
          <div><update-device /></div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import EnvConfig from 'src/components/system/EnvConfig.vue'
import ChangeHostname from 'src/components/network/ChangeHostname.vue'
import PingSupervisor from 'src/components/system/PingSupervisor.vue'
import UpdateDevice from 'src/components/system/UpdateDevice.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntPageIndex',
  components: { ChangeHostname, PingSupervisor, EnvConfig, UpdateDevice },
  setup() {
    return {}
  }
})
</script>
