<template>
  <div v-if="!isLoading" class="row items-end q-mt-none q-mb-md text-h4">
    <q-slide-transition :duration="1000">
      <div v-if="sdkDevice" class="row">
        {{ sdkDevice.data.device_name }}
      </div>
      <div v-else-if="!isSdkLoading">
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
        :loading="isSdkLoading"
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
    <div v-if="$q.screen.gt.sm && !isSdkLoading">
      <q-chip
        clickable
        :icon="
          networkStore.isCloudlink ? 'arrow_circle_up' : 'arrow_circle_down'
        "
        :color="networkStore.isCloudlink ? 'positive' : 'negative'"
        text-color="white"
        :label="$t('components.system.device_info.cloudlink')"
        @click="checkCloudlink()"
      >
        <q-tooltip
          class="bg-secondary"
          anchor="center middle"
          self="top middle"
        >
          {{
            $t('components.system.device_info.check_cloudlink_tooltip')
          }}</q-tooltip
        >
      </q-chip>
      <q-chip
        v-if="sdkDevice && networkStore.isCloudlink"
        icon="power"
        :color="sdkDevice.data.is_undervolted ? 'negative' : 'positive'"
        text-color="white"
      >
        {{
          sdkDevice.data.is_undervolted
            ? $t('components.system.device_info.undervolted')
            : $t('components.system.device_info.not_undervolted')
        }}
      </q-chip>
    </div>
    <div v-else-if="!isSdkLoading">
      <q-icon
        class="cursor-pointer"
        :name="
          sdkDevice?.data.is_online ? 'arrow_circle_up' : 'arrow_circle_down'
        "
        :color="sdkDevice?.data.is_online ? 'positive' : 'negative'"
        @click="checkCloudlink()"
      />
      <q-icon
        v-if="sdkDevice && networkStore.isCloudlink"
        name="power"
        :color="sdkDevice.data.is_undervolted ? 'negative' : 'positive'"
      />
    </div>
  </div>
  <div v-if="m && f && supervisorDevice && !isLoading">
    <div class="justify-between row q-mb-sm no-wrap">
      <div class="col"><cpu-stats /></div>
      <div class="row items-center q-ml-sm">
        <memory-stats />
      </div>
    </div>
    <q-separator class="q-ma-sm bg-grey-5" />
    <div :class="$q.screen.gt.sm ? 'q-mt-md' : ''">
      <q-card class="q-ma-sm" flat>
        <q-card-section :horizontal="$q.screen.gt.sm ? true : false">
          <q-linear-progress
            v-if="temperature?.data.main"
            class="q-mt-xs"
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
          <div v-if="$q.screen.gt.sm" class="q-ma-xs"></div>
          <q-linear-progress
            class="q-mt-xs"
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
          <q-item v-if="sdkDevice" class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.location') }}
              </q-item-label>
              <q-item-label>{{ sdkDevice.data.location }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.os_version') }}
              </q-item-label>
              <q-item-label>
                {{ supervisorDevice.os_version }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.supervisor_version') }}
              </q-item-label>
              <q-item-label>
                {{ supervisorDevice.supervisor_version }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.ip_address') }}
              </q-item-label>
              <q-item-label>{{ supervisorDevice.ip_address }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.mac_address') }}
              </q-item-label>
              <q-item-label>{{ supervisorDevice.mac_address }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="sdkDevice" class="q-mb-sm">
            <q-item-section>
              <q-item-label caption>
                {{ $t('components.system.device_info.public_ip') }}
              </q-item-label>
              <q-item-label>
                {{ sdkDevice.data.public_address }}
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

interface sdkDeviceRes {
  location: string
  os_release: string
  public_address: string
  cpu_temp: number
  is_undervolted: boolean
  is_online: boolean
  device_name: string
}

interface supervisorDeviceRes {
  current_release: string
  ip_address: string
  mac_address: string
  os_version: string
  supervisor_version: string
  target_release: string
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
    const f = ref<f>()
    const isSdkLoading = ref<boolean>()
    const m = ref<m>()
    const quasarMode = ref(process.env.MODE)
    const sdkDevice = ref<AxiosResponse<sdkDeviceRes>>()
    const supervisorDevice = ref<supervisorDeviceRes>()
    const networkStore = networkSettings()
    const temperature = ref<temperature>()

    onMounted(async () => {
      // If Electron or PWA app, perform the Cloudlink check as boot process has not initiated
      if ($q.platform.is.electron || quasarMode.value === 'pwa') {
        void checkCloudlink()
      }

      // If on a fleet then fetch data from the SDK
      if (networkStore.isCloudlink) {
        void getSdkDeviceInfo()
      }

      // Fetch local data from system
      await getLocalDeviceInfo()
      isLoading.value = false
    })

    // Listen for change to isCloudlink in case first response is slow or recheck is triggered
    watch(
      () => networkStore.isCloudlink,
      (val) => {
        if (val === true) {
          void getSdkDeviceInfo()
        }
      }
    )

    function checkCloudlink() {
      void networkStore.checkCloudlink()
    }

    function fsSize() {
      return expressApi.post('/v1/system/systeminfo', {
        id: cmdFsSize?.id
      })
    }

    async function getLocalDeviceInfo() {
      try {
        const results = await Promise.all([
          fsSize(),
          mem(),
          temperat(),
          getSupervisorInfo()
        ])
        f.value = results[0].data as f
        m.value = results[1].data as m
        temperature.value = results[2].data as temperature
        supervisorDevice.value = results[3].data as supervisorDeviceRes
      } catch (error) {
        console.error(error)
      }
    }

    async function getSdkDeviceInfo() {
      isSdkLoading.value = true
      try {
        sdkDevice.value = await sdk.device()
      } catch (error) {
        console.error(error)
        $q.notify({
          type: 'negative',
          message: t('components.system.device_info.sdk_unavailable')
        })
        isSdkLoading.value = false
      }
      isSdkLoading.value = false
    }

    async function getSupervisorInfo() {
      return supervisor.v1.device()
    }

    function mem() {
      return expressApi.post('/v1/system/systeminfo', {
        id: cmdMem?.id
      })
    }

    function oUrl(url: string) {
      openURL(url, undefined, {
        width: 1050
      })
    }

    function temperat() {
      return expressApi.post('/v1/system/systeminfo', {
        id: cmdTemp?.id
      })
    }

    return {
      baseUrl,
      checkCloudlink,
      f,
      isLoading,
      m,
      oUrl,
      quasarMode,
      qSpinnerStyle,
      isSdkLoading,
      sdkDevice,
      supervisorDevice,
      networkStore,
      temperature
    }
  }
})
</script>
