<template>
  <div v-if="currentPage == '#/captiveportal'"><captive-portal /></div>
  <router-view v-else />
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineAsyncComponent, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'App',
  components: {
    CaptivePortal: defineAsyncComponent(
      () => import('components/layouts/CaptivePortal.vue')
    )
  },
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()

    // Show loading indicator as early as possible in loading process.
    // Is disabled by the router afterEach function in router/index.ts
    $q.loading.show()

    // Get the current page path to check if this is a captive portal
    const currentPage = location.hash

    // Set a dismiss function var and remove immediately to store function in var
    let dismiss = $q.notify({})
    dismiss()

    // When network is available again
    window.addEventListener('online', () => {
      dismiss()
      dismiss = notify('positive', t('network.network_connection_restored'))
    })

    // When network is down
    window.addEventListener('offline', () => {
      dismiss()
      dismiss = notify('warning', t('network.network_connection_down'))
    })

    function notify(type: string, message: string) {
      const dismiss = $q.notify({
        type: type,
        multiLine: true,
        timeout: 0,
        actions: [
          {
            label: t('general.close'),
            color: 'white',
            handler: () => {
              /* ... */
            }
          }
        ],
        message: message
      })
      return dismiss
    }

    return { currentPage }
  }
})
</script>
