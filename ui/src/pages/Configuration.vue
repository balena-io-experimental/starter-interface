<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md q-mt-md">
      {{ $t('system.titles.supervisor_config') }}
    </div>
    <component-frame :components="[ChangeHostname]" />

    <div class="text-h5 q-mb-md q-mt-md">
      {{ $t('system.titles.services') }}
    </div>
    <q-list>
      <component-frame :components="[UpdateDevice, ForgetAllWifi]" />
    </q-list>

    <div
      v-if="internetConnectivity.status"
      flat
      bordered
      class="text-h5 q-mb-md q-mt-md"
    >
      {{ $t('components.system.device_info.environment_variables') }}
    </div>
    <component-frame :components="[EnvConfig]" />
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'src/components/styles/ComponentFrame.vue'
import ChangeHostname from 'components/network/ChangeHostname.vue'
import ForgetAllWifi from 'src/components/wifi/ForgetAllWifi.vue'
import UpdateDevice from 'components/system/UpdateDevice.vue'
import { defineAsyncComponent, defineComponent } from 'vue'
import { internetConnectivity } from 'src/api/SystemRequests'

export default defineComponent({
  name: 'IntConfiguration',
  components: {
    ComponentFrame
  },
  setup() {
    return {
      internetConnectivity,
      ChangeHostname,
      EnvConfig: defineAsyncComponent(
        () => import('components/system/EnvConfig.vue')
      ),
      ForgetAllWifi,
      UpdateDevice
    }
  }
})
</script>
