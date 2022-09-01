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
  <input-device-hostname />
</template>

<script lang="ts">
import InputDeviceHostname from 'components/InputDeviceHostname.vue'
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

export default defineComponent({
  name: 'LayoutsPwaLayout',
  components: {
    InputDeviceHostname
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
    return { installApp, showInstallBanner }
  }
})
</script>
