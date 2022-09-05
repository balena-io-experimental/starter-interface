<template>
  <q-btn
    v-bind="qBtnStyle"
    :loading="isSubmitting"
    icon="wifi_off"
    :label="$t('components.wifi.forget_all_wifi.forget_all_wifi')"
    @click="confirm = true"
  />
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section
        class="row items-center"
        style="width: 300px; max-width: 80vw"
      >
        <q-avatar v-bind="qAvatarStyle" icon="wifi_tethering_off" />
        <span class="q-ml-md">{{ $t('general.are_you_sure') }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup v-bind="qBtnStyle" :label="$t('general.cancel')" />
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          :label="$t('general.ok')"
          @click="forget()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { expressApi } from 'boot/axios'
import { useQuasar } from 'quasar'
import { qAvatarStyle, qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'WifiForgetAllWifi',
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const isSubmitting = ref<boolean>(false)

    async function forget() {
      isSubmitting.value = true

      try {
        await expressApi.post('/v1/wifi', {
          type: 'POST',
          path: 'v1/forget',
          params: {
            all_networks: true
          }
        })

        // Delay to improve interface interaction
        setTimeout(() => {
          $q.notify({
            type: 'positive',
            multiLine: true,
            timeout: 0,
            actions: [
              {
                label: t('general.close'),
                handler: () => {
                  /* ... */
                }
              }
            ],
            message: t(
              'components.wifi.forget_all_wifi.disconnect_request_sent'
            )
          })
          isSubmitting.value = false
        }, 1000)
      } catch {
        $q.notify({ type: 'negative', message: t('general.error') })
        isSubmitting.value = false
      }
    }

    return {
      confirm: ref(false),
      forget,
      isSubmitting,
      qAvatarStyle,
      qBtnStyle
    }
  }
})
</script>
