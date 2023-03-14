<template>
  <div v-if="isNoWifiConnect" class="text-center">
    {{ $t('system.network.wifi_connect_not_installed') }}
  </div>
  <q-form v-else class="flex flex-col" @submit="connect()">
    <div class="col">
      <div v-if="!isWifiStatus && !isLoading">
        <div>
          <div class="row justify-end text-center">
            <q-expansion-item
              class="q-pd-xl"
              expand-separator
              dense
              :label="$t('components.wifi.connect.configure_hotspot')"
            >
              <div class="q-pt-xs">
                <configure-s-s-i-d />
              </div>
              <div class="q-pt-xs">
                <configure-password />
              </div>
              <div class="q-pt-xs">
                <ForgetAllWifi />
              </div>
            </q-expansion-item>
          </div>
          <q-select
            v-model="wifiConnection"
            :label="$t('components.wifi.connect.select_ssid')"
            :options="ssids"
            option-label="ssid"
            :disable="isWifiStatus"
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
                      scope.opt.strength > 60 ? 'text-positive' : 'text-warning'
                    "
                    size="40px"
                    :thickness="0.13"
                    :color="scope.opt.strength > 60 ? 'positive' : 'warning'"
                    track-color="grey-3"
                  >
                    <div class="text-center">
                      <q-icon name="signal_cellular_alt" />
                      {{ scope.opt.strength }}
                    </div>
                  </q-knob>
                </q-item-section>
              </q-item>
            </template>
            <template #after>
              <q-btn
                round
                dense
                flat
                color="primary"
                icon="refresh"
                :disable="!isRefreshCompatible || isWifiStatus"
                @click="fetchNetworks()"
              />
              <q-tooltip
                v-if="!isRefreshCompatible"
                class="text-caption text-center"
                anchor="top middle"
                self="center middle"
                :offset="[20, 20]"
                :disable="!isRefreshCompatible"
              >
                {{ $t('components.wifi.connect.refresh_not_compatible') }}
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
            (val.length === 0 || val.length > 7)
            || $t('components.wifi.connect.invalid_password_length')]"
            :label="$t('general.password')"
            type="password"
            :disable="isWifiStatus || wifiConnection?.value?.conn_type === 'NONE'"
          />
        </div>
        <div class="q-mt-md text-center">
          <q-btn
            v-bind="qBtnStyle"
            :label="$t('components.wifi.connect.connect')"
            :loading="isSubmitting"
            type="submit"
          />
        </div>
      </div>
      <div v-else-if="!isLoading" class="text-center">
        <div>
          {{ $t('components.wifi.connect.already_connected') }}
        </div>
        <q-btn
          class="q-mt-md"
          v-bind="qBtnStyle"
          :disable="isNoWifiConnect"
          :label="$t('components.wifi.connect.disconnect')"
          :loading="isSubmitting"
          @click="forget()"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { expressApi } from 'boot/axios'
import ConfigurePassword from 'components/WifiConfigurePassword.vue'
import ConfigureSSID from 'components/WifiConfigureSSID.vue'
import ForgetAllWifi from 'components/WifiForgetAllWifi.vue'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'src/config/qStyles'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface ConnectionDataReq {
  conn_type: string
  ssid: Array<string>
}

interface NetworksDataRes {
  iw_compatible: boolean
  ssids: Array<string>
}

interface WifiStatusRes {
  wifi: boolean
}

interface WifiParams {
  ssid: string
  conn_type: string
  password?: string
}

export default defineComponent({
  name: 'WifiConnect',
  components: {
    ConfigurePassword,
    ConfigureSSID,
    ForgetAllWifi
  },
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    // Env vars
    const isLoading = ref<boolean>(true)
    const isNoWifiConnect = ref<boolean>(false)
    const isRefreshCompatible = ref<boolean>(true)
    const isSubmitting = ref<boolean>(false)
    const isWifiStatus = ref<boolean>(true)
    const password = ref<string>('')
    const ssids = ref<Array<string>>()
    const wifiConnection = ref<ConnectionDataReq>()

    onMounted(async () => {
      await checkWifiStatus()
      isLoading.value = false
    })

    async function checkWifiStatus() {
      // Override default delay to 0 to avoid flashing when moving from router
      // loading indicator to this one
      $q.loading.show({ delay: 0 })

      try {
        const response = await expressApi.post<WifiStatusRes>('/v1/wifi', {
          type: 'GET',
          path: 'v1/connection_status'
        })

        if (!response.data.wifi) {
          isWifiStatus.value = false
          await fetchNetworks()
        }
      } catch {
        isNoWifiConnect.value = true
      }
      $q.loading.hide()
    }

    async function connect() {
      isSubmitting.value = true
      const params:WifiParams = {
        ssid: wifiConnection?.value?.ssid,
        conn_type: wifiConnection?.value?.conn_type
      }
      if (wifiConnection?.value?.conn_type !== 'NONE') {
        params.password = password?.value
      }
      try {
        await expressApi.post('/v1/wifi', {
          type: 'POST',
          path: 'v1/connect',
          params
        })

        isWifiStatus.value = true
        // Delay to improve interface interaction
        setTimeout(() => {
          notify('positive', t('components.wifi.connect.connection_request'))
          isSubmitting.value = false
        }, 2000)
      } catch {
        notify('negative', t('components.wifi.connect.network_connect_fail'))
        isSubmitting.value = false
      }
      password.value = ''
    }

    async function fetchNetworks() {
      $q.loading.show({
        message: t('components.wifi.connect.searching_networks')
      })
      try {
        const response = await expressApi.post<NetworksDataRes>('/v1/wifi', {
          type: 'GET',
          path: 'v1/list_access_points'
        })

        isRefreshCompatible.value = response.data.iw_compatible
        ssids.value = response.data.ssids
        if (ssids.value.length === 0) {
          notify('warning', t('components.wifi.connect.no_networks'))
        }
      } catch {
        notify('negative', t('components.wifi.connect.network_fetch_fail'))
      }
      isSubmitting.value = false
      $q.loading.hide()
    }

    async function forget() {
      isSubmitting.value = true
      try {
        await expressApi.post('/v1/wifi', {
          type: 'POST',
          path: 'v1/forget',
          params: {
            all_networks: false
          }
        })

        isWifiStatus.value = false
        // Delay to improve interface interaction
        setTimeout(() => {
          notify(
            'positive',
            t('components.wifi.connect.disconnect_request_sent')
          )
          isSubmitting.value = false
        }, 1000)
      } catch {
        notify('negative', t('components.wifi.connect.network_forget_fail'))
        isSubmitting.value = false
      }
    }

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

    return {
      connect,
      fetchNetworks,
      forget,
      isLoading,
      isNoWifiConnect,
      isRefreshCompatible,
      isSubmitting,
      isWifiStatus,
      password,
      qBtnStyle,
      ssids,
      wifiConnection
    }
  }
})
</script>

<style scoped></style>
