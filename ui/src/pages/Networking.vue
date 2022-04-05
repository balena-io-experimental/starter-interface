<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <div class="row justify-end">
        <q-item>
          <q-item-section>
            <q-item-label overline>
              {{ $t('components.wifi.connect.configure_hotspot') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div class="row justify-end">
        <component-frame
          class="q-mr-xs"
          :components="[WifiConnectConfigureSSID]"
        />
        <component-frame
          class="q-mr-xs"
          :components="[WifiConnectConfigurePassword]"
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
