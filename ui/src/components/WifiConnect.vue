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
          :label="$t('select_ssid')"
          :options="ssids"
          option-label="ssid"
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
                  font-size="13px"
                  :class="scope.opt.strength > 60 ? 'text-green' : 'text-orange'"
                  size="40px"
                  :thickness="0.13"
                  :color="scope.opt.strength > 60 ? 'green' : 'orange'"
                  track-color="grey-3"
                >
                  <div class="m-2 text-center">
                    <q-icon
                      name="signal_cellular_alt"
                    />
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
              :disable="!refreshCompatible"
              @click="fetchNetworks()"
            />
            <q-tooltip
              v-if="!refreshCompatible"
              class="text-caption text-center"
              anchor="top middle"
              self="center middle"
              :offset="[20, 20]"
            >
              {{ $t('refresh_not_compatible') }}
            </q-tooltip>
          </template>
        </q-select>
      </div>
      <div>
        <q-input
          v-model="password"
          class="q-mt-md"
          filled
          :label="$t('password')"
          type="password"
        />
      </div>
      <div class="q-mt-md text-center">
        <q-btn
          :label="$t('connect')"
          class="q-ml-md"
          :disabled="!wifiSsid"
          :loading="submitting"
          type="submit"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import Axios from 'axios'
import { useQuasar } from 'quasar'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'WifiConnectComponent',
  setup () {
    // Import required features
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    // Override the default Axios instance as the error handling is not needed here
    const wifiApi = Axios.create()

    const hostname = ref<string>(window.location.hostname)
    const password = ref<string>('')
    const refreshCompatible = ref<boolean>(false)
    const ssids = ref<any>([])
    const submitting = ref<boolean>(false)
    const wifiSsid = ref<any>('')

    onMounted(async () => {
      await fetchNetworks()
    })

    // Send connect request
    async function connect () {
      submitting.value = true
      await wifiApi.post(`http://${hostname.value}:9090/v1/connect`, {
        ssid: wifiSsid.value.ssid,
        conn_type: wifiSsid.value.conn_type,
        password: password.value
      }).then(() => {
        // Delay to improve interface interaction
        setTimeout(() => {
          $q.notify({
            type: 'positive',
            multiLine: true,
            timeout: 0,
            actions: [
              {
                label: t('close'),
                color: 'white',
                handler: () => { /* ... */ }
              }
            ],
            message: t('connection_request')
          })
          submitting.value = false
        }, 2000)
      })
        .catch(function () {
          $q.notify({
            type: 'negative',
            multiLine: true,
            timeout: 0,
            actions: [
              {
                label: t('close'),
                color: 'white',
                handler: () => { /* ... */ }
              }
            ],
            message: t('network_connect_fail')
          })
        })
      wifiSsid.value = ''
      password.value = ''
    }

    async function fetchNetworks () {
      $q.loading.show({ message: t('searching_networks') })
      await wifiApi.get(`http://${hostname.value}:9090/v1/list_access_points`).then((response) => {
        refreshCompatible.value = response.data.compatible
        ssids.value = response.data.ssids
        if (ssids.value.length === 0) {
          $q.notify({
            type: 'warning',
            multiLine: true,
            timeout: 0,
            actions: [
              {
                label: t('close'),
                color: 'white',
                handler: () => { /* ... */ }
              }
            ],
            message: t('no_networks')
          })
        }
      }).catch(function (error) {
        console.log(error)
        $q.notify({
          type: 'negative',
          multiLine: true,
          timeout: 0,
          actions: [
            {
              label: t('close'),
              color: 'white',
              handler: () => { /* ... */ }
            }
          ],
          message: t('network_fetch_fail')
        })
      })
      submitting.value = false
      $q.loading.hide()
    }

    return {
      connect,
      fetchNetworks,
      password,
      refreshCompatible,
      ssids,
      submitting,
      wifiSsid
    }
  }
})

</script>

<style scoped>

</style>
