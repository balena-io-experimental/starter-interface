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
          :components="[
            { component: ConfigureSSID },
            { component: ConfigurePassword }
          ]"
          :rows="true"
        />
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

export default defineComponent({
  name: 'NetworkingPage',
  components: {
    ComponentFrame
  },
  setup() {
    return {
      Connect,
      ConfigurePassword,
      ConfigureSSID
    }
  }
})
</script>
