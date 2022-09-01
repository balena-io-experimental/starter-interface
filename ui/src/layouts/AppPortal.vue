<template>
  <q-bar v-if="$q.platform.is.electron" class="bg-accent q-electron-drag" dense>
    <div class="row justify-between content-center full-width no-wrap">
      <div class="col-4 no-wrap">
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="red"
          @click="electronCloseApp"
        />
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="yellow"
          @click="electronMinimize"
        />
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="green"
          @click="electronToggleMaximize"
        />
      </div>
      <div class="no-wrap">
        <q-avatar
          v-if="$q.platform.is.electron"
          square
          size="xs"
          class="q-mr-sm"
        >
          <img :src="qHeaderStyle.logo_coloured" /> </q-avatar
        >{{ $t('title') }}
      </div>
      <div class="col-4"></div>
    </div>
  </q-bar>
  <q-slide-transition>
    <q-banner
      v-if="showInstallBanner"
      dense
      inline-actions
      class="text-white bg-primary"
    >
      {{ $t('system.pwa.install_notification') }}
      <template #action>
        <q-btn
          flat
          color="white"
          :label="$t('general.close')"
          @click="installApp(false)"
        />
        <q-btn
          flat
          color="white"
          :label="$t('system.pwa.install')"
          @click="installApp(true)"
        />
      </template>
    </q-banner>
  </q-slide-transition>

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
        @click="setAxios(tab.title)"
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
import { defineComponent, onMounted, ref } from 'vue'
import { useQuasar, QInput } from 'quasar'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface tabIndex {
  title: string
}

declare const window: Window &
  typeof globalThis & {
    myWindowAPI: {
      close: () => void
      minimize: () => void
      toggleMaximize: () => void
    }
  }

export default defineComponent({
  name: 'LayoutsCaptivePortal',
  components: {
    DeviceInfo
  },
  setup() {
    const axiosBaseUrl = axiosSettings()
    const currentTab = ref('welcome')
    const showInstallBanner = ref(false)
    const quasarMode = ref(process.env.MODE)
    const reqHostname = ref('')
    const $q = useQuasar()
    const tabs = ref<tabIndex[]>([])
    const validateHostInput = ref<QInput>()

    let deferredPrompt: BeforeInstallPromptEvent

    onMounted(() => {
      if (
        process.env.MODE === 'pwa' &&
        $q.localStorage.getItem('dismissedInstall') !== true
      ) {
        window.addEventListener('beforeinstallprompt', (event) => {
          event.preventDefault()
          deferredPrompt = event

          showInstallBanner.value = true
        })
      }
    })

    function addHttp(url: string) {
      if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = `http://${url}`
      }
      return url
    }

    // Electron toolbar controls
    function closeTab(index: number) {
      currentTab.value = 'welcome'
      tabs.value.splice(index, 1)
    }

    function electronCloseApp() {
      window.myWindowAPI.close()
    }

    function electronMinimize() {
      window.myWindowAPI.minimize()
    }

    function electronToggleMaximize() {
      window.myWindowAPI.toggleMaximize()
    }

    function installApp(install: boolean) {
      if (!install) {
        showInstallBanner.value = false
        $q.localStorage.set('dismissedInstall', true)
        return
      }

      try {
        void deferredPrompt.prompt()
        showInstallBanner.value = false
        $q.localStorage.set('dismissedInstall', true)
      } catch (error) {
        console.error(error)
        showInstallBanner.value = false
      }
    }

    function setAxios(currentTabSetting: string) {
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
      setAxios(reqHost)
      currentTab.value = reqHost
      reqHostname.value = ''
    }

    return {
      closeTab,
      electronMinimize,
      electronToggleMaximize,
      electronCloseApp,
      currentTab,
      installApp,
      qHeaderStyle,
      quasarMode,
      reqHostname,
      setAxios,
      setHostname,
      showInstallBanner,
      tabs,
      validateHostInput
    }
  }
})
</script>
