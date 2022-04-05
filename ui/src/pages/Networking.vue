<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <div class="float-right">
        <q-list bordered padding style="max-width: 350px">
          <q-item>
            <q-item-section>
              <q-item-label overline>
                {{ $t('components.wifi.connect.configure_hotspot') }}
              </q-item-label>
              <div class="row justify-center q-mt-sm">
                <div class="q-mr-sm">
                  <WifiConnectConfigureSSID />
                </div>
                <div><WifiConnectConfigurePassword /></div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div>
        <wifi-connect />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import WifiConnect from 'components/wifi/Connect.vue'
import WifiConnectConfigurePassword from 'components/wifi/ConfigurePassword.vue'
import WifiConnectConfigureSSID from 'components/wifi/ConfigureSSID.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntNetworking',
  components: {
    WifiConnect,
    WifiConnectConfigurePassword,
    WifiConnectConfigureSSID
  },
  setup() {
    return {}
  }
})
</script>
