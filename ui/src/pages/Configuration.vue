<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md">
      {{ $t('system.titles.host_config') }}
    </div>
    <component-frame :components="[{ component: ChangeHostname }]" />

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
import ChangeHostname from 'components/SystemChangeHostname.vue'
import UpdateDevice from 'components/SystemUpdateDevice.vue'
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { useSystemStore } from 'stores/system'
import { defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfigurationPage',
  components: {
    ComponentFrame
  },
  setup() {
    const systemStore = useSystemStore()
    return {
      ChangeHostname,
      EnvConfig: defineAsyncComponent(
        () => import('src/components/SystemEnvConfig.vue')
      ),
      systemStore,
      UpdateDevice
    }
  }
})
</script>
