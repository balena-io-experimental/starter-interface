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
          @click="installAppPrompt(false)"
        />
        <q-btn
          flat
          color="white"
          :label="$t('system.pwa.install')"
          @click="installAppPrompt(true)"
        />
      </template>
    </q-banner>
  </q-slide-transition>
  <device-tab-selector />
</template>

<script lang="ts">
import DeviceTabSelector from 'components/DeviceTabSelector.vue'
import { defineComponent, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

// Interface to handle the prompt to install the PWA app
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Interface to handle the prompt to install the PWA app
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default defineComponent({
  name: 'PwaLayout',
  components: {
    DeviceTabSelector
  },
  setup() {
    const showInstallBanner = ref(false)
    const $q = useQuasar()
    let deferredPrompt: BeforeInstallPromptEvent

    onMounted(() => {
      if (
        process.env.MODE === 'pwa' &&
        $q.localStorage.getItem('dismissedInstall') !== true
      ) {
        // An event listener is required as browsers limit direct calling of the install
        // prompt to avoid users being spammed with requests. This is why install prompts
        // appear random times, it is controller by the browser and intentionally randomised
        window.addEventListener('beforeinstallprompt', (event) => {
          event.preventDefault()
          deferredPrompt = event

          showInstallBanner.value = true
        })
      }
    })

    // Prompt user to install the app
    function installAppPrompt(install: boolean) {
      if (install) {
        try {
          void deferredPrompt.prompt()
          $q.localStorage.set('dismissedInstall', true)
        } catch (error) {
          console.error(error)
          showInstallBanner.value = false
        }
      } else {
        $q.localStorage.set('dismissedInstall', true)
      }
      showInstallBanner.value = false
    }

    return { installAppPrompt, showInstallBanner }
  }
})
</script>
