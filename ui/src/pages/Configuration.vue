<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md">
      {{ $t('components.system.device_info.network_config') }}
    </div>
    <component-frame :components="[{ component: ChangeHostname }]" />
    <div v-if="networkStore.isCloudlink">
      <div class="text-h5 q-mb-md q-mt-md">
        {{ $t('components.system.device_info.environment_variables') }}
      </div>
      <component-frame :components="[{ component: EnvConfig }]" />
    </div>
  </q-page>
</template>

<script lang="ts">
import ChangeHostname from 'components/SystemChangeHostname.vue'
import UpdateDevice from 'components/SystemUpdateDevice.vue'
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { networkSettings } from 'stores/system'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfigurationPage',
  components: {
    ComponentFrame
  },
  setup() {
    const networkStore = networkSettings()
    return {
      ChangeHostname,
      EnvConfig: defineAsyncComponent(
        () => import('src/components/SystemEnvConfig.vue')
      ),
      networkStore,
      UpdateDevice
    }
  }
})
</script>
