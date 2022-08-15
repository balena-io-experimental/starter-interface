<template>
  <q-page class="q-pa-lg">
    <div>
      <div class="row justify-end">
        <q-expansion-item
          expand-separator
          :label="$t('components.wifi.connect.configure_hotspot')"
        >
          <component-frame
            :components="[
              { component: ConfigureSSID },
              { component: ConfigurePassword },
              { component: ForgetAllWifi }
            ]"
            :rows="false"
            class="text-center"
          />
        </q-expansion-item>
      </div>
      <div>
        <component-frame :components="[{ component: Connect }]" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'layouts/ComponentFrame.vue'
import Connect from 'components/WifiConnect.vue'
import ConfigurePassword from 'components/WifiConfigurePassword.vue'
import ConfigureSSID from 'components/WifiConfigureSSID.vue'
import { defineComponent } from 'vue'
import ForgetAllWifi from 'components/WifiForgetAllWifi.vue'

export default defineComponent({
  name: 'NetworkingPage',
  components: {
    ComponentFrame
  },
  setup() {
    return {
      Connect,
      ConfigurePassword,
      ConfigureSSID,
      ForgetAllWifi
    }
  }
})
</script>
