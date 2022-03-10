<template>
  <q-form
    class="mb-5 flex flex-col"
    :style="$q.screen.gt.sm ? 'min-width: 40vw' : 'min-width: 90vw'"
    @submit="connect()"
  >
    <div class="col">
      <div class="q-ml-md">
        <q-select
          v-model="wifiSsid"
          class="mb-3"
          :label="$t('wifi.select_ssid')"
          :options="ssids"
          option-label="ssid"
          :disable="wifiStatus"
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.ssid }}</q-item-label>
              </q-item-section>
              <q-item-section
                v-if="scope.opt.strength && scope.opt.ssid"
                avatar
              >
                <q-knob
                  v-model="scope.opt.strength"
                  show-value
                  font-size="11px"
                  :class="
                    scope.opt.strength > 60 ? 'text-green' : 'text-orange'
                  "
                  size="40px"
                  :thickness="0.13"
                  :color="scope.opt.strength > 60 ? 'green' : 'orange'"
                  track-color="grey-3"
                >
                  <div class="m-2 text-center">
                    <q-icon name="signal_cellular_alt" />
                    {{ scope.opt.strength }}
                  </div>
                </q-knob>
              </q-item-section>
            </q-item>
          </template>
          <template #after>
            <q-btn
              class="mt-1"
              round
              dense
              flat
              color="primary"
              icon="refresh"
              :disable="!refreshCompatible || wifiStatus"
              @click="fetchNetworks()"
            />
            <q-tooltip
              v-if="!refreshCompatible"
              class="text-caption text-center"
              anchor="top middle"
              self="center middle"
              :offset="[20, 20]"
              :disable="!refreshCompatible"
            >
              {{ $t('wifi.refresh_not_compatible') }}
            </q-tooltip>
          </template>
        </q-select>
      </div>
      <div>
        <q-input
          v-model="password"
          class="q-mt-md"
          filled
          hide-bottom-space
          :rules="[(val: string) =>
            val.length > 7
            || $t('wifi.invalid_password_length')]"
          :label="$t('general.password')"
          type="password"
          :disable="wifiStatus"
        />
      </div>
      <div class="q-mt-md text-center">
        <q-btn
          v-if="!wifiStatus"
          v-bind="qBtnStyle"
          :label="$t('wifi.Connect')"
          class="q-ml-md"
          :loading="submitting"
          type="submit"
        />
        <q-btn
          v-else
          v-bind="qBtnStyle"
          :disable="noWifiConnect"
          :label="$t('wifi.Disconnect')"
          class="q-ml-md"
          :loading="submitting"
          @click="forget()"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import axios from 'axios'
import expressApi, { AxiosError } from 'axios'
import { qBtnStyle } from 'components/styles/qStyles'
import { useQuasar } from 'quasar'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface connectionData {
  conn_type: string
  ssid: Array<string>
}

interface networksData {
  iw_compatible: boolean
  ssids: Array<string>
}

interface wifiStatus {
  wifi: boolean
}

export default defineComponent({
  name: 'IntWifiConnectComponent',
  setup() {
    // Import required features
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    // Env vars
    const noWifiConnect = ref<boolean>(false)
    const password = ref<string>('')
    const refreshCompatible = ref<boolean>(true)
    const ssids = ref<Array<string>>()
    const submitting = ref<boolean>(false)
    const wifiSsid = ref<connectionData>()
    const wifiStatus = ref<boolean>(true)

    onMounted(async () => {
      await checkWifiStatus()
    })

    async function checkWifiStatus() {
      $q.loading.show()

      await expressApi
        .post<wifiStatus>('/v1/wifi', {
          type: 'GET',
          path: 'v1/connection_status'
        })
        .then(async (response) => {
          if (!response.data.wifi) {
            wifiStatus.value = false
            await fetchNetworks()
          }
        })
        .catch(function (err: Error | AxiosError) {
          if (axios.isAxiosError(err)) {
            if (err.response) {
              notify('negative', t('wifi.network_request_fail'))
            } else {
              notify('warning', t('wifi.no_wifi_api'))
            }
          }

          noWifiConnect.value = true
        })
      $q.loading.hide()
    }

    // Send connect request
    async function connect() {
      submitting.value = true
      await expressApi
        .post('/v1/wifi', {
          type: 'POST',
          path: 'v1/connect',
          params: {
            network: {
              ssid: wifiSsid?.value?.ssid,
              conn_type: wifiSsid?.value?.conn_type,
              password: password.value
            }
          }
        })
        .then(() => {
          wifiStatus.value = true
          // Delay to improve interface interaction
          setTimeout(() => {
            notify('positive', t('wifi.connection_request'))
            submitting.value = false
          }, 2000)
        })
        .catch(function () {
          notify('negative', t('wifi.network_connect_fail'))
          submitting.value = false
        })
      password.value = ''
    }

    async function fetchNetworks() {
      $q.loading.show({ message: t('wifi.searching_networks') })
      await expressApi
        .post<networksData>('/v1/wifi', {
          type: 'GET',
          path: 'v1/list_access_points'
        })
        .then((response) => {
          refreshCompatible.value = response.data.iw_compatible
          ssids.value = response.data.ssids
          if (ssids.value.length === 0) {
            notify('warning', t('wifi.no_networks'))
          }
        })
        .catch(function () {
          notify('negative', t('wifi.network_fetch_fail'))
        })
      submitting.value = false
      $q.loading.hide()
    }

    function forget() {
      submitting.value = true
      expressApi
        .post('/v1/wifi', {
          type: 'POST',
          path: 'v1/forget',
          params: {
            all_networks: false
          }
        })
        .then(() => {
          wifiStatus.value = false
          // Delay to improve interface interaction
          setTimeout(() => {
            notify('positive', t('wifi.disconnect_request_sent'))
            submitting.value = false
          }, 1000)
        })
        .catch(function () {
          notify('negative', t('wifi.network_forget_fail'))
          submitting.value = false
        })
    }

    function notify(type: string, message: string) {
      $q.notify({
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
    }

    return {
      connect,
      fetchNetworks,
      forget,
      noWifiConnect,
      password,
      qBtnStyle,
      refreshCompatible,
      ssids,
      submitting,
      wifiSsid,
      wifiStatus
    }
  }
})
</script>

<style scoped></style>
