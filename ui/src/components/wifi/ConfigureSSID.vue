<template>
  <div>
    <q-btn
      v-bind="qBtnStyle"
      icon="drive_file_rename_outline"
      color="primary"
      :loading="submitting"
      @click="ssidDialog = true"
    >
      <q-tooltip> {{ $t('wifi.set_new_hotspot_ssid') }}</q-tooltip>
    </q-btn>

    <q-dialog v-model="ssidDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            class="q-mr-md"
            icon="drive_file_rename_outline"
            color="primary"
            text-color="accent"
          />
          <q-input
            ref="SSIDInput"
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
                $t('wifi.invalid_name')
            ]"
            :label="$t('wifi.set_new_hotspot_ssid')"
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
import expressApi from 'axios'
import { QForm, useQuasar } from 'quasar'
import { qBtnStyle } from 'components/styles/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IntWifiConfigSSIDComponent',
  setup() {
    // Import required features
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const SSIDInput = ref<QForm>()
    const ssidText = ref<string>('')

    const submitting = ref<boolean>(false)

    function notify(type: string, message: string) {
      $q.notify({
        type: type,
        multiLine: true,
        timeout: 0,
        actions: [
          {
            label: t('general.close'),
            color: 'accent',
            handler: () => {
              /* ... */
            }
          }
        ],
        message: message
      })
    }

    // Set SSID
    async function setHotspotSSID() {
      if (!SSIDInput.value?.validate()) {
        return
      }
      submitting.value = true
      await expressApi
        .post('/v1/wifi', {
          type: 'POST',
          path: 'v1/set_hotspot_ssid',
          params: { ssid: ssidText.value }
        })
        .then(() => {
          notify('positive', t('wifi.ssid_set'))
          submitting.value = false
        })
        .catch(function () {
          notify('negative', t('wifi.no_wifi_api'))
        })
      ssidText.value = ''
      submitting.value = false
    }

    return {
      qBtnStyle,
      ssidDialog: ref(false),
      SSIDInput,
      ssidText,
      setHotspotSSID,
      submitting
    }
  }
})
</script>

<style scoped></style>
