<template>
  <q-page class="q-pa-lg">
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
    <div class="q-mt-lg"><env-config /></div>
  </q-page>
</template>

<script lang="ts">
import EnvConfig from 'components/system/EnvConfig.vue'
import ChangeHostname from 'components/network/ChangeHostname.vue'
import PingSupervisor from 'components/system/PingSupervisor.vue'
import UpdateDevice from 'components/system/UpdateDevice.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntConfiguration',
  components: { ChangeHostname, PingSupervisor, EnvConfig, UpdateDevice },
  setup() {
    return {}
  }
})
</script>
