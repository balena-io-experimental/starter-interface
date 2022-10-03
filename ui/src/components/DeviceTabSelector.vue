<template>
  <q-toolbar class="bg-accent">
    <q-avatar v-if="quasarMode === 'pwa'" square size="sm">
      <img :src="qHeaderStyle.logo_coloured" />
    </q-avatar>
    <q-space />

    <q-tabs
      v-model="currentTab"
      no-caps
      flat
      dense
      outside-arrows
      mobile-arrows
      shrink
      stretch
    >
      <q-tab
        name="welcome"
        :label="$t('components.layouts.captive_portal.welcome')"
      />
      <q-tab
        v-for="(tab, index) in tabs"
        :key="tab.title"
        :name="tab.title"
        @click="setAxiosBaseUrl(tab.title)"
      >
        <div>
          <span class="q-mr-sm">{{ tab.title }}</span>
          <q-btn
            color="blue-grey-6"
            icon="cancel"
            size="xs"
            dense
            flat
            @click.stop="closeTab(index)"
          />
        </div>
      </q-tab>
    </q-tabs>
    <q-space />
  </q-toolbar>
  <q-separator />
  <q-tab-panels v-model="currentTab" animated swipeable>
    <q-tab-panel class="q-pa-lg text-center" name="welcome">
      <!-- Logo -->
      <div class="q-mb-md">
        <img :src="qHeaderStyle.logo_coloured" style="max-width: 175px" />
      </div>
      <!-- Title -->
      <div class="text-h4 q-mb-md">
        {{ $t('title') }}
      </div>
      <q-input
        ref="validateHostInput"
        v-model="reqHostname"
        type="url"
        clearable
        :rules="[
          (value: string) =>
            (!value.includes(' ') && value != '') ||
            $t('components.wifi.configure_password.invalid_name')
        ]"
        placeholder="balena.local"
        class="q-mt-md"
        filled
        hide-bottom-space
        :label="$t('general.hostname')"
        @keydown.enter.prevent="setHostname(reqHostname)"
      >
        <template #after>
          <q-btn
            flat
            dense
            padding="0"
            icon="send"
            :disable="!reqHostname"
            @click="setHostname(reqHostname)"
          />
        </template>
      </q-input>
      <div class="row text-center q-mt-sm text-grey-8 justify-center">
        <div
          v-if="quasarMode === 'pwa'"
          :style="$q.screen.gt.xs ? 'max-width: 80%' : ''"
        >
          <q-expansion-item
            expand-separator
            dense
            dense-toggle
            :label="$t('system.pwa.install_notification')"
          >
            <q-card>
              <q-separator class="q-ma-sm" />
              <div>{{ $t('system.pwa.install_instructions_safari') }}</div>
              <div>{{ $t('system.pwa.install_instructions_chrome') }}</div>
              <div>{{ $t('system.pwa.install_instructions_browsers') }}</div>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
    </q-tab-panel>

    <q-tab-panel v-for="tab in tabs" :key="tab.title" :name="tab.title">
      <div class="q-pa-sm q-ml-md q-mr-md">
        <device-info />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts">
import DeviceInfo from 'components/SystemDeviceInfo.vue'
import { qHeaderStyle } from 'src/config/qStyles'
import { axiosSettings } from 'stores/system'
import { defineComponent, ref } from 'vue'
import { QInput } from 'quasar'

interface TabIndex {
  title: string
}

export default defineComponent({
  name: 'DeviceTabSelector',
  components: {
    DeviceInfo
  },
  setup() {
    const axiosBaseUrl = axiosSettings()
    const currentTab = ref('welcome')
    const quasarMode = ref(process.env.MODE)
    const reqHostname = ref('')
    const tabs = ref<TabIndex[]>([])
    const validateHostInput = ref<QInput>()

    // Add http:// to URL string if it a protocol is missing
    function addHttp(url: string) {
      if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = `http://${url}`
      }
      return url
    }

    function closeTab(index: number) {
      currentTab.value = 'welcome'
      tabs.value.splice(index, 1)
    }

    function setAxiosBaseUrl(currentTabSetting: string) {
      currentTabSetting = addHttp(currentTabSetting)
      axiosBaseUrl.setUrl(currentTabSetting)
    }

    function setHostname(reqHost: string) {
      // If hostname input box is empty then return
      if (!validateHostInput.value?.validate()) {
        return
      }
      tabs.value?.push({
        title: reqHost
      })
      setAxiosBaseUrl(reqHost)
      currentTab.value = reqHost
      reqHostname.value = ''
    }

    return {
      closeTab,
      currentTab,
      qHeaderStyle,
      quasarMode,
      reqHostname,
      setAxiosBaseUrl,
      setHostname,
      tabs,
      validateHostInput
    }
  }
})
</script>
