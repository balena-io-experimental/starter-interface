<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md">
      {{ $t('system.titles.supervisor_config') }}
    </div>
    <component-frame :components="[{ component: ChangeHostname }]" />

    <div class="text-h5 q-mb-md q-mt-md">
      {{ $t('system.titles.services') }}
    </div>
    <component-frame
      :components="[{ component: UpdateDevice }, { component: ForgetAllWifi }]"
    />

    <div
      v-if="systemStore.internetConnectivity"
      class="text-h5 q-mb-md q-mt-md"
    >
      {{ $t('components.system.device_info.environment_variables') }}
    </div>
    <component-frame
      v-if="systemStore.internetConnectivity"
      :components="[{ component: EnvConfig }]"
    />
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'layouts/ComponentFrame.vue'
import ChangeHostname from 'components/SystemChangeHostname.vue'
import ForgetAllWifi from 'components/WifiForgetAllWifi.vue'
import UpdateDevice from 'components/SystemUpdateDevice.vue'
import { defineAsyncComponent, defineComponent } from 'vue'
import { useSystemStore } from 'stores/system'

export default defineComponent({
  name: 'ConfigurationPage',
  components: {
    ComponentFrame
  },
  setup() {
    const systemStore = useSystemStore()
    return {
      systemStore,
      ChangeHostname,
      EnvConfig: defineAsyncComponent(
        () => import('src/components/SystemEnvConfig.vue')
      ),
      ForgetAllWifi,
      UpdateDevice
    }
  }
})
</script>
