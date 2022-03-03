<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        v-model="model"
        filled
        :loading="loadingRequest"
        :options="options"
        :label="$t('systeminfo.select_request')"
        @update:model-value="getSystemInfo(model)"
      />
    </div>
  </div>
  <q-expansion-item
    expand-separator
    default-opened
    icon="code"
    :label="$t('deviceInfo.response_details')"
    :caption="$t('deviceInfo.raw_json')"
  >
    <pre v-if="response">{{ response.data }}</pre>
  </q-expansion-item>
</template>

<script lang="ts">
import { expressApi } from 'src/boot/axios'
import { AxiosResponse } from 'axios'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DeviceInfoComponent',
  setup() {
    const loadingRequest = ref<boolean>(false)
    const response = ref<AxiosResponse>()

    const options = [
      { cmd: 'a', label: 'audio' },
      { cmd: 'B', label: 'baseboard' },
      { cmd: 'Y', label: 'battery' },
      { cmd: 'b', label: 'bios' },
      { cmd: 'e', label: 'blockDevices' },
      { cmd: 'h', label: 'bluetoothDevices' },
      { cmd: 'C', label: 'chassis' },
      { cmd: 'c', label: 'cpu' },
      { cmd: 'j', label: 'cpuCurrentSpeed' },
      { cmd: 'T', label: 'cpuTemperature' },
      { cmd: 'l', label: 'currentLoad' },
      { cmd: 'd', label: 'diskLayout' },
      { cmd: 'D', label: 'disksIO' },
      { cmd: '0', label: 'dockerContainerProcesses' },
      { cmd: '8', label: 'dockerContainers' },
      { cmd: '9', label: 'dockerContainerStats' },
      { cmd: '7', label: 'dockerImages' },
      { cmd: '6', label: 'dockerInfo' },
      { cmd: '+', label: 'dockerVolumes' },
      { cmd: 'E', label: 'fsOpenFiles' },
      { cmd: 'f', label: 'fsSize' },
      { cmd: 'F', label: 'fsStats' },
      { cmd: 'L', label: 'fullLoad' },
      { cmd: '/', label: 'getAllData' },
      { cmd: '.', label: 'getDynamicData' },
      { cmd: ',', label: 'getStaticData' },
      { cmd: 'g', label: 'graphics' },
      { cmd: 'I', label: 'inetChecksite' },
      { cmd: 'i', label: 'inetLatency' },
      { cmd: 'm', label: 'mem' },
      { cmd: 'M', label: 'memLayout' },
      { cmd: '5', label: 'networkConnections' },
      { cmd: '2', label: 'networkGatewayDefault' },
      { cmd: '1', label: 'networkInterfaceDefault' },
      { cmd: '3', label: 'networkInterfaces' },
      { cmd: '4', label: 'networkStats' },
      { cmd: 'o', label: 'osInfo' },
      { cmd: 'r', label: 'printer' },
      { cmd: 'p', label: 'processes' },
      { cmd: 'P', label: 'processLoad' },
      { cmd: 's', label: 'services' },
      { cmd: 'S', label: 'shell' },
      { cmd: 'y', label: 'system' },
      { cmd: 'w', label: 'temwifiNetworksp' },
      { cmd: 'u', label: 'usb' },
      { cmd: 'z', label: 'users' },
      { cmd: 'U', label: 'uuid' },
      { cmd: 'V', label: 'vboxInfo' },
      { cmd: 'v', label: 'versions' },
      { cmd: 'x', label: 'wifiConnections' },
      { cmd: 'W', label: 'wifiInterfaces' }
    ]

    async function getSystemInfo(model: { cmd: null | string } | null) {
      if (model != null) {
        loadingRequest.value = true
        await expressApi
          .post('/v1/system/systeminfo', {
            cmd: model.cmd
          })
          .then((res) => {
            response.value = res
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      loadingRequest.value = false
    }

    return {
      getSystemInfo,
      loadingRequest,
      model: ref(null),
      options,
      response
    }
  }
})
</script>
