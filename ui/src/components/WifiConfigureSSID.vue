<template>
  <div>
    <q-btn
      v-bind="qBtnStyle"
      icon="drive_file_rename_outline"
      :loading="isSubmitting"
      :label="$t('components.wifi.configure_ssid.set_new_hotspot_ssid')"
      @click="ssidDialog = true"
    />

    <q-dialog v-model="ssidDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            v-bind="qAvatarStyle"
            class="q-mr-md"
            icon="drive_file_rename_outline"
          />
          <q-input
            ref="ssidInput"
            v-model="ssidText"
            bottom-slots
            :rules="[
              (value) =>
                (!value.includes('?') &&
                  !value.includes('\\') &&
                  !value.includes('$') &&
                  !value.includes('[') &&
                  !value.includes('\\') &&
                  !value.includes(']') &&
                  value.length < 32 &&
                  !value.includes('+')) ||
                $t('components.wifi.configure_ssid.invalid_name')
            ]"
            :label="$t('components.wifi.configure_ssid.set_new_hotspot_ssid')"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            v-bind="qBtnStyle"
            flat
            :label="$t('general.cancel')"
          />
          <q-btn
            v-close-popup
            v-bind="qBtnStyle"
            flat
            :disable="!ssidText"
            :label="$t('general.ok')"
            @click="setHotspotSSID()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { expressApi } from 'boot/axios'
import { QForm, useQuasar } from 'quasar'
import { qAvatarStyle, qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'WifiConfigureSSID',
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const isSubmitting = ref<boolean>(false)
    const ssidInput = ref<QForm>()
    const ssidText = ref<string>('')

    function notify(type: string, message: string) {
      $q.notify({
        type,
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
        message
      })
    }

    async function setHotspotSSID() {
      if (!ssidInput.value?.validate()) {
        return
      }
      isSubmitting.value = true

      try {
        await expressApi.post('/v1/wifi', {
          type: 'POST',
          path: 'v1/set_hotspot_ssid',
          params: { ssid: ssidText.value }
        })

        notify('positive', t('components.wifi.configure_ssid.ssid_set'))
        isSubmitting.value = false
      } catch {
        notify('negative', t('system.network.no_wifi_api'))
      }

      ssidText.value = ''
      isSubmitting.value = false
    }

    return {
      isSubmitting,
      qAvatarStyle,
      qBtnStyle,
      ssidDialog: ref(false),
      ssidInput,
      ssidText,
      setHotspotSSID
    }
  }
})
</script>

<style scoped></style>
