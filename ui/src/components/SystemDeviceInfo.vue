<template>
  <div v-if="!isLoading" class="row items-end q-mt-none q-mb-md text-h4">
    <q-slide-transition :duration="1000">
      <div v-if="sdkResponse" class="row">
        {{ sdkResponse.data.device_name }}
      </div>
      <div v-else-if="!sdkLoading">
        {{ baseUrl.host }}
      </div>
      <!-- Avoid components jumping around screen by adding empty space --->
      <div v-else><br /></div>
    </q-slide-transition>
    <div>
      <q-btn
        v-if="$q.platform.is.electron || quasarMode == 'pwa'"
        class="q-ml-sm text-grey-9"
        flat
        :loading="sdkLoading"
        size="md"
        dense
        padding="0"
        icon="launch"
        @click="oUrl(baseUrl.href)"
      >
        <q-tooltip
          class="bg-secondary"
          anchor="bottom right"
          self="bottom start"
          :offset="[-5, 20]"
        >
          {{ $t('general.open_control_panel') }}</q-tooltip
        >
      </q-btn>
    </div>
    <q-space />
    <div v-if="$q.screen.gt.sm && !sdkLoading">
      <q-chip
        clickable
        :icon="
          sdkResponse?.data.is_online && systemStore.internetConnectivity
            ? 'arrow_circle_up'
            : 'arrow_circle_down'
        "
        :color="
          sdkResponse?.data.is_online && systemStore.internetConnectivity
            ? 'positive'
            : 'negative'
        "
        text-color="white"
        :label="$t('components.system.device_info.cloudlink')"
        @click="checkInternet()"
      >
        <q-tooltip
          class="bg-secondary"
          anchor="center middle"
          self="top middle"
        >
          {{
            $t('components.system.device_info.check_internet_tooltip')
          }}</q-tooltip
        >
      </q-chip>
      <q-chip
        v-if="sdkResponse && systemStore.internetConnectivity"
        icon="power"
        :color="sdkResponse.data.is_undervolted ? 'negative' : 'positive'"
        text-color="white"
      >
        {{
          sdkResponse.data.is_undervolted
            ? $t('components.system.device_info.undervolted')
            : $t('components.system.device_info.not_undervolted')
        }}
      </q-chip>
    </div>
    <div v-else-if="!sdkLoading">
      <q-icon
        class="cursor-pointer"
        :name="
          sdkResponse?.data.is_online ? 'arrow_circle_up' : 'arrow_circle_down'
        "
        :color="sdkResponse?.data.is_online ? 'positive' : 'negative'"
        @click="checkInternet()"
      />
      <q-icon
        v-if="sdkResponse && systemStore.internetConnectivity"
        name="power"
        :color="sdkResponse.data.is_undervolted ? 'negative' : 'positive'"
      />
    </div>
  </div>
  <div v-if="m && f && device && !isLoading">
    <div class="justify-between row q-mb-sm no-wrap">
      <div class="col"><cpu-stats /></div>
      <div class="row items-center q-ml-sm">
        <memory-stats />
      </div>
    </div>
    <q-separator class="q-ma-sm bg-grey-5" />
    <div class="q-mt-md">
      <q-card class="q-ma-sm" flat>
        <q-card-section :horizontal="$q.screen.gt.sm ? true : false">
          <q-linear-progress
            v-if="temperature?.data.main"
            class="q-ml-xs q-mr-xs q-mt-xs"
            stripe
            rounded
            :color="temperature.data.main > 65 ? 'warning' : 'positive'"
            size="20px"
            :value="temperature.data.main / 100"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="primary"
                :label="`${$t('components.system.device_info.temperature')}:
                  ${temperature.data.main.toFixed(2)}°C`"
              />
            </div>
          </q-linear-progress>
          <q-linear-progress
            class="q-ml-xs q-mr-xs q-mt-xs"
            stripe
            rounded
            size="20px"
            :value="f.data[0].used / f.data[0].size"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="primary"
                :label="`${$t('components.system.device_info.storage')}: ${(
                  f.data[0].used / 1000000000
                ).toFixed(2)}GB /
                ${(f.data[0].size / 1000000000).toFixed(2)}GB`"
              />
            </div>
          </q-linear-progress>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-mt-sm">
      <q-card flat class="text-center">
        <q-list class="justify-evenly row">
          <q-item v-if="sdkResponse" class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.location') }}
              </q-item-label>
              <q-item-label>{{ sdkResponse.data.location }}</q-item-label>
            </q-item-section>
          </q-item>
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
          <q-item v-if="sdkResponse" class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.public_ip') }}
              </q-item-label>
              <q-item-label>
                {{ sdkResponse.data.public_address }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </div>
  <div v-if="isLoading" class="window-height row justify-center items-center">
    <q-spinner v-bind="qSpinnerStyle" />
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { expressApi } from 'boot/axios'
import CpuStats from 'components/ChartsCpuStats.vue'
import MemoryStats from 'components/ChartsMemoryStats.vue'
import { openURL, useQuasar } from 'quasar'
import { sdk } from 'src/api/sdk'
import { supervisor } from 'src/api/supervisor'
import sysInfoCmds from 'src/api/sysInfoCmds'
import { qSpinnerStyle } from 'src/config/qStyles'
import { axiosSettings, networkSettings } from 'stores/system'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

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

interface sdkResponses {
  location: string
  os_release: string
  public_address: string
  cpu_temp: number
  is_undervolted: boolean
  is_online: boolean
  device_name: string
}

interface temperature {
  data: {
    main: number
    cores: [number]
  }
}

export default defineComponent({
  name: 'SystemOfflineDeviceInfo',
  components: { CpuStats, MemoryStats },
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    // Tools
    const axiosUrlStore = axiosSettings()
    const baseUrl = axiosUrlStore.$state.axiosBaseUrl
      ? new URL(axiosUrlStore.$state.axiosBaseUrl)
      : new URL(window.location.origin)
    const isLoading = ref<boolean>(true)

    // Constants
    const cmdFsSize = sysInfoCmds.find((cmd) => cmd.id === 'f')
    const cmdMem = sysInfoCmds.find((cmd) => cmd.id === 'm')
    const cmdTemp = sysInfoCmds.find((cmd) => cmd.id === 'T')
    const device = ref<device>()
    const f = ref<f>()
    const m = ref<m>()
    const quasarMode = ref(process.env.MODE)
    const sdkLoading = ref<boolean>()
    const sdkResponse = ref<AxiosResponse<sdkResponses>>()
    const systemStore = networkSettings()
    const temperature = ref<temperature>()

    onMounted(async () => {
      // If Electron or PWA app, perform the internet check as boot process has not initiated
      if ($q.platform.is.electron || quasarMode.value === 'pwa') {
        void systemStore.checkInternetStatus()
      }
      // If there is internet connectivity then fetch data from the SDK
      if (systemStore.internetConnectivity) {
        void getSdkDeviceInfo()
      }
      // Fetch local data and wait
      await getDeviceInfo()
      isLoading.value = false
    })

    // Listen for change to internetConnectivity in case first response is slow
    watch(
      () => systemStore.internetConnectivity,
      (val) => {
        if (val === true) {
          void getSdkDeviceInfo()
        }
      }
    )

    function checkInternet() {
      void systemStore.checkInternetStatus()
    }

    // Axios Functions
    function deviceInfo() {
      return supervisor.v1.device()
    }

    function fsSize() {
      return expressApi.post('/v1/system/systeminfo', {
        id: cmdFsSize?.id
      })
    }

    async function getDeviceInfo() {
      try {
        const results = await Promise.all([
          deviceInfo(),
          fsSize(),
          mem(),
          temperat()
        ])

        device.value = results[0].data as device
        f.value = results[1].data as f
        m.value = results[2].data as m
        temperature.value = results[3].data as temperature
      } catch (error) {
        console.error(error)
      }
    }

    async function getSdkDeviceInfo() {
      try {
        sdkLoading.value = true
        sdkResponse.value = await sdk.device()
        sdkLoading.value = false
      } catch (error) {
        console.error(error)
        $q.notify({
          type: 'negative',
          message: t('components.system.device_info.sdk_unavailable')
        })
      }
    }

    function mem() {
      return expressApi.post('/v1/system/systeminfo', {
        id: cmdMem?.id
      })
    }

    function oUrl(url: string) {
      openURL(url, undefined, {
        width: '1050'
      })
    }

    function temperat() {
      return expressApi.post('/v1/system/systeminfo', {
        id: cmdTemp?.id
      })
    }

    return {
      baseUrl,
      checkInternet,
      device,
      f,
      isLoading,
      m,
      oUrl,
      quasarMode,
      qSpinnerStyle,
      sdkLoading,
      sdkResponse,
      systemStore,
      temperature
    }
  }
})
</script>
