<!-- eslint-disable @intlify/vue-i18n/no-raw-text */ -->
<template>
  <div v-if="m && f && device && !loading">
    <h4 class="row items-end q-mt-none q-mb-lg">
      <q-chip
        :color="internetConnectivity.status ? 'green' : 'red'"
        text-color="white"
      >
        {{
          internetConnectivity.status ? $t('wifi.online') : $t('wifi.offline')
        }}
      </q-chip>
    </h4>
    <div><cpu-stats /></div>
    <div class="row items-start">
      <q-card flat bordered class="">
        <q-card-section horizontal>
          <!-- info -->
          <q-card-section>
            <q-list>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.os_version')
                  }}</q-item-label>
                  <q-item-label>
                    {{ device.os_version }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.supervisor_version')
                  }}</q-item-label>
                  <q-item-label>
                    {{ device.supervisor_version }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.ip_address')
                  }}</q-item-label>
                  <q-item-label>{{ device.ip_address }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.mac_address')
                  }}</q-item-label>
                  <q-item-label>{{ device.mac_address }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <!-- end info -->
          <q-separator vertical />
          <!-- bars -->
          <q-card-section>
            <q-card-section>
              <b class="q-mr-xs">{{ $t('deviceInfo.memory') }}</b>
              <span> - </span>
              <span
                >{{
                  ((m.data.total - m.data.available) / 1000000).toFixed(0)
                }}MB / {{ (m.data.total / 1000000).toFixed(0) }}MB</span
              >
              <q-linear-progress
                color="secondary"
                rounded
                :value="(m.data.total - m.data.available) / m.data.total"
                class="q-mt-md"
              />
            </q-card-section>
            <q-card-section>
              <b class="q-mr-xs">{{ $t('deviceInfo.storage') }}</b>
              <span>({{ f.data[0].mount }})</span>
              <span> - </span>
              <span
                >{{ (f.data[0].used / 1000000000).toFixed(2) }}GB /
                {{ (f.data[0].size / 1000000000).toFixed(2) }}GB</span
              >
              <q-linear-progress
                color="secondary"
                rounded
                :value="f.data[0].used / f.data[0].size"
                class="q-mt-md"
              />
            </q-card-section>
          </q-card-section>
          <!-- end bars -->
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios'
import { expressApi } from 'boot/axios'
import CpuStats from 'components/charts/CpuStats.vue'
import { useQuasar } from 'quasar'
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { internetConnectivity } from 'src/api/SystemRequests'
import { defineComponent, onMounted, ref } from 'vue'

interface device {
  current_release: string
  ip_address: string
  mac_address: string
  os_version: string
  supervisor_version: string
  target_release: string
}

interface f {
  data: {
    [index: number]: {
      available: number
      mount: string
      size: number
      total: number
      used: number
    }
  }
}

interface m {
  data: {
    available: number
    total: number
  }
}

export default defineComponent({
  name: 'IntOfflineDeviceInfoComponent',
  components: { CpuStats },
  setup() {
    // Tools
    const loading = ref<boolean>(true)
    const $q = useQuasar()

    // Constants
    const device = ref<device>()
    const f = ref<f>()
    const m = ref<m>()

    // Axios Functions
    function deviceInfo() {
      return supervisorRequests.device()
    }

    function fsSize() {
      return expressApi.post('/v1/system/systeminfo', {
        cmd: 'f'
      })
    }

    function mem() {
      return expressApi.post('/v1/system/systeminfo', {
        cmd: 'm'
      })
    }

    // Functions
    async function getDeviceInfo() {
      await Promise.all([deviceInfo(), fsSize(), mem()])
        .then(function (results) {
          device.value = results[0].data as device
          f.value = results[1].data as f
          m.value = results[2].data as m
        })
        .catch(function (error: Error | AxiosError) {
          console.log(error)
        })
    }

    onMounted(async () => {
      $q.loading.show()
      await getDeviceInfo()
      loading.value = false
      $q.loading.hide()
    })

    return {
      device,
      f,
      internetConnectivity,
      loading,
      m
    }
  }
})
</script>
