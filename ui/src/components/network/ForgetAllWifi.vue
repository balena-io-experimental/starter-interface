<template>
  <q-btn
    v-bind="qBtnStyle"
    :loading="submitting"
    :label="$t('network.forget_all_wifi')"
    @click="confirm = true"
  />
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section
        class="row items-center"
        style="width: 300px; max-width: 80vw"
      >
        <q-avatar
          icon="wifi_tethering_off"
          color="primary"
          text-color="accent"
        />
        <span class="q-ml-md">{{ $t('general.are_you_sure') }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          flat
          :label="$t('general.cancel')"
          color="primary"
        />
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          flat
          :label="$t('general.ok')"
          color="primary"
          @click="forget()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import expressApi from 'axios'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'components/styles/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IntForgetAllWifiComponent',
  setup() {
    const submitting = ref<boolean>(false)
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    function forget() {
      submitting.value = true
      expressApi
        .post('/v1/wifi', {
          type: 'POST',
          path: 'v1/forget',
          params: {
            all_networks: true
          }
        })
        .then(() => {
          // Delay to improve interface interaction
          setTimeout(() => {
            $q.notify({
              type: 'positive',
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
              message: t('wifi.disconnect_request_sent')
            })
            submitting.value = false
          }, 1000)
        })
        .catch(function (err) {
          console.log(err)
          $q.notify({ type: 'negative', message: t('general.Error') })
          submitting.value = false
        })
    }

    return {
      confirm: ref(false),
      forget,
      qBtnStyle,
      submitting
    }
  }
})
</script>
