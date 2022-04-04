<template>
  <q-page class="q-pa-lg">
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md q-mt-md">{{ $t('supervisor_config') }}</div>
        <change-hostname />
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md q-mt-md">{{ $t('system.services') }}</div>
        <q-list>
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
          <q-item>
            <q-item-section avatar>
              <q-icon name="wifi_tethering_off" />
            </q-item-section>

            <q-item-section>
              <div><forget-all-wifi /></div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card v-if="internetConnectivity.status" flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md q-mt-md">
          {{ $t('device_info.environment_variables') }}
        </div>
        <env-config />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import ChangeHostname from 'components/network/ChangeHostname.vue'
import ForgetAllWifi from 'components/network/ForgetAllWifi.vue'
import PingSupervisor from 'components/system/PingSupervisor.vue'
import UpdateDevice from 'components/system/UpdateDevice.vue'
import { defineAsyncComponent, defineComponent } from 'vue'
import { internetConnectivity } from 'src/api/SystemRequests'

export default defineComponent({
  name: 'IntConfiguration',
  components: {
    ChangeHostname,
    EnvConfig: defineAsyncComponent(
      () => import('components/system/EnvConfig.vue')
    ),
    ForgetAllWifi,
    PingSupervisor,
    UpdateDevice
  },
  setup() {
    return { internetConnectivity }
  }
})
</script>
