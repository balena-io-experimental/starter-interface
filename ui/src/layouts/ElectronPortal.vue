<template>
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
  <q-tabs
    v-model="currentTab"
    no-caps
    outside-arrows
    mobile-arrows
    class="bg-accent shadow-2"
  >
    <q-tab
      name="welcome"
      :label="$t('components.layouts.captive_portal.welcome')"
    />
    <q-tab
      v-for="(tab, index) in tabs"
      :key="tab"
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
        v-model="reqHostname"
        clearable
        :rules="[
          (value: string) =>
            !value.includes(' ') ||
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
            icon="send"
            :disable="!reqHostname"
            @click="setHostname(reqHostname)"
          /> </template
      ></q-input>
    </q-tab-panel>

    <q-tab-panel v-for="tab in tabs" :key="tab.title" :name="tab.title">
      <div class="q-pa-lg">
        <device-info />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts">
import DeviceInfo from 'components/SystemDeviceInfo.vue'
import { qHeaderStyle } from 'src/config/qStyles'
import { axiosUrl } from 'stores/system'
import { defineComponent, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

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

export default defineComponent({
  name: 'LayoutsCaptivePortal',
  components: {
    DeviceInfo
  },
  setup() {
    const axiosBaseUrl = axiosUrl()
    const currentTab = ref('welcome')
    const showInstallBanner = ref(false)
    const reqHostname = ref('')
    const $q = useQuasar()
    const tabs = ref<tabIndex[]>([])

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

    function closeTab(index: number) {
      currentTab.value = 'welcome'
      tabs.value.splice(index, 1)
    }

    function setAxios(currentTabSetting: string) {
      axiosBaseUrl.setUrl(`http://${currentTabSetting}`)
    }

    function setHostname(reqHost: string) {
      tabs.value?.push({
        title: reqHost
      })
      setAxios(reqHost)
      currentTab.value = reqHost
      reqHostname.value = ''
    }

    return {
      closeTab,
      currentTab,
      installApp,
      qHeaderStyle,
      reqHostname,
      setAxios,
      setHostname,
      showInstallBanner,
      tabs
    }
  }
})
</script>
