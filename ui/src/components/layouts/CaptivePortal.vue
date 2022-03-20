<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <q-tabs
    v-model="tab"
    no-caps
    outside-arrows
    mobile-arrows
    class="bg-primary shadow-2"
  >
    <q-tab name="welcome" :label="$t('captive_portal.Welcome')" />
    <q-tab name="wifi" :label="$t('captive_portal.connect_to_wifi')" />
  </q-tabs>

  <!-- Welcome page -->
  <div v-if="tab == 'welcome'" class="q-pa-lg text-center">
    <!-- Logo -->
    <div class="q-mb-md">
      <q-img :src="qHeaderStyle.logo" style="max-width: 175px" />
    </div>
    <!-- Title -->
    <div class="text-h4 q-mb-md">
      {{ $t('titles.title') }}
    </div>
    <!-- Welcome text -->
    <div v-if="hostname" class="text-body1 text-center text-gray-600">
      <div>
        {{ $t('captive_portal.visit_to_begin') }}
      </div>
      <div class="q-mt-md">
        http://{{ hostname }}.local
        <q-btn
          class="q-ml-2"
          icon="content_copy"
          padding="0"
          flat
          size="sm"
          @click="copyUrl()"
        >
          <q-tooltip class="text-caption text-center">
            {{ $t('captive_portal.copy_to_clipboard') }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>

  <!-- Wi-Fi page -->
  <div v-else>
    <wifi-connect class="q-pa-lg" />
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import WifiConnect from 'components/wifi/Connect.vue'
import { copyToClipboard, useQuasar } from 'quasar'
import { qHeaderStyle } from 'components/styles/qStyles'
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface hostConfig {
  network: { hostname: string }
}

export default defineComponent({
  name: 'IntCaptivePortal',
  components: {
    WifiConnect
  },
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()

    const hostname = ref<string>()

    onMounted(async () => {
      await supervisorRequests
        .device_host_config_get()
        .then((res: AxiosResponse<hostConfig>) => {
          hostname.value = res.data.network.hostname
        })
        .catch((err) => {
          console.log(err)
        })
    })

    const copyUrl = () => {
      if (hostname.value) {
        void copyToClipboard(`http://${hostname.value}.local`)
        $q.notify(t('captive_portal.url_copied'))
      }
    }

    return {
      copyUrl,
      hostname,
      qHeaderStyle,
      tab: ref('welcome')
    }
  }
})
</script>
