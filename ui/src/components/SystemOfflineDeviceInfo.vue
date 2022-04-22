<!-- eslint-disable @intlify/vue-i18n/no-raw-text */ -->
<template>
  <div v-if="m && f && device && !isLoading">
    <q-chip
      :color="systemStore.internetConnectivity ? 'positive' : 'negative'"
      text-color="white"
    >
      {{
        systemStore.internetConnectivity
          ? $t('components.system.device_info.online')
          : $t('components.system.device_info.offline')
      }}
    </q-chip>
    <div class="q-mb-sm">
      <cpu-stats />
    </div>
    <div>
      <div class="q-mb-md">
        <q-card flat bordered>
          <q-card-section horizontal>
            <q-card-section class="full-width">
              <b class="q-mr-xs">{{
                $t('components.system.device_info.memory')
              }}</b>
              <span> - </span>
              <span
                >{{
                  ((m.data.total - m.data.available) / 1000000).toFixed(0)
                }}MB / {{ (m.data.total / 1000000).toFixed(0) }}MB</span
              >
              <q-linear-progress
                rounded
                :value="(m.data.total - m.data.available) / m.data.total"
                class="q-mt-md"
              />
            </q-card-section>
            <q-card-section class="full-width">
              <b class="q-mr-xs">{{
                $t('components.system.device_info.storage')
              }}</b>
              <span>({{ f.data[0].mount }})</span>
              <span> - </span>
              <span
                >{{ (f.data[0].used / 1000000000).toFixed(2) }}GB /
                {{ (f.data[0].size / 1000000000).toFixed(2) }}GB</span
              >
              <q-linear-progress
                rounded
                :value="f.data[0].used / f.data[0].size"
                class="q-mt-md"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <div>
        <q-card flat>
          <q-card-section>
            <q-list class="row">
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.os_version') }}
                  </q-item-label>
                  <q-item-label>
                    {{ device.os_version }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.supervisor_version') }}
                  </q-item-label>
                  <q-item-label>
                    {{ device.supervisor_version }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.ip_address') }}
                  </q-item-label>
                  <q-item-label>{{ device.ip_address }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.mac_address') }}
                  </q-item-label>
                  <q-item-label>{{ device.mac_address }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="window-height row justify-center items-center">
    <q-spinner v-bind="qSpinnerStyle" />
  </div>
</template>

<script lang="ts">
import { expressApi } from 'boot/axios'
import CpuStats from 'components/ChartsCpuStats.vue'
import { supervisor } from 'src/api/supervisor'
import { useSystemStore } from 'stores/system'
import { defineComponent, onMounted, ref } from 'vue'
import { qSpinnerStyle } from 'src/config/qStyles'

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
  name: 'SystemOfflineDeviceInfo',
  components: { CpuStats },
  setup() {
    const systemStore = useSystemStore()

    // Tools
    const isLoading = ref<boolean>(true)

    // Constants
    const device = ref<device>()
    const f = ref<f>()
    const m = ref<m>()

    // Axios Functions
    function deviceInfo() {
      return supervisor.device()
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
      try {
        const results = await Promise.all([deviceInfo(), fsSize(), mem()])

        device.value = results[0].data as device
        f.value = results[1].data as f
        m.value = results[2].data as m
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(async () => {
      await getDeviceInfo()
      isLoading.value = false
    })

    return {
      device,
      f,
      isLoading,
      m,
      qSpinnerStyle,
      systemStore
    }
  }
})
</script>
