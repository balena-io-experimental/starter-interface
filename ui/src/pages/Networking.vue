<template>
  <q-page class="q-pa-lg">
    <div>
      <div class="row justify-end">
        <q-item-label class="q-mr-sm q-mb-sm" overline>
          {{ $t('components.wifi.connect.configure_hotspot') }}
        </q-item-label>
      </div>
      <div class="row justify-end">
        <component-frame
          :components="[WifiConnectConfigureSSID, WifiConnectConfigurePassword]"
          :rows="true"
        />
      </div>
      <div>
        <component-frame :components="[WifiConnect]" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'src/components/styles/ComponentFrame.vue'
import WifiConnect from 'components/wifi/Connect.vue'
import WifiConnectConfigurePassword from 'components/wifi/ConfigurePassword.vue'
import WifiConnectConfigureSSID from 'components/wifi/ConfigureSSID.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntNetworking',
  components: {
    ComponentFrame
  },
  setup() {
    return {
      WifiConnect,
      WifiConnectConfigurePassword,
      WifiConnectConfigureSSID
    }
  }
})
</script>
