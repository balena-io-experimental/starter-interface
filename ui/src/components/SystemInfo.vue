<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        v-model="model"
        filled
        :options="options"
        label="Standard"
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
    const response = ref<AxiosResponse>()

    const options = [
      { cmd: 'a', label: 'audio' },
      { cmd: 'b', label: 'bios' },
      { cmd: 'B', label: 'baseboard' },
      { cmd: 'C', label: 'chassis' },
      { cmd: 'c', label: 'cpu' },
      { cmd: 'd', label: 'diskLayout' },
      { cmd: 'D', label: 'disksIO' },
      { cmd: 'e', label: 'blockDevices' },
      { cmd: 'E', label: 'fsOpenFiles' },
      { cmd: 'f', label: 'fsSize' },
      { cmd: 'F', label: 'fsStats' },
      { cmd: 'g', label: 'graphics' },
      { cmd: 'h', label: 'bluetoothDevices' },
      { cmd: 'i', label: 'inetLatency' },
      { cmd: 'I', label: 'inetChecksite' },
      { cmd: 'j', label: 'cpuCurrentSpeed' },
      { cmd: 'l', label: 'currentLoad' },
      { cmd: 'L', label: 'fullLoad' },
      { cmd: 'm', label: 'mem' },
      { cmd: 'M', label: 'memLayout' },
      { cmd: 'o', label: 'osInfo' },
      { cmd: 'p', label: 'processes' },
      { cmd: 'P', label: 'processLoad' },
      { cmd: 'r', label: 'printer' },
      { cmd: 's', label: 'services' },
      { cmd: 'S', label: 'shell' },
      { cmd: 'T', label: 'cpuTemperature' },
      { cmd: 'u', label: 'usb' },
      { cmd: 'U', label: 'uuid' },
      { cmd: 'v', label: 'versions' },
      { cmd: 'V', label: 'vboxInfo' },
      { cmd: 'w', label: 'temwifiNetworksp' },
      { cmd: 'W', label: 'wifiInterfaces' },
      { cmd: 'x', label: 'wifiConnections' },
      { cmd: 'y', label: 'system' },
      { cmd: 'Y', label: 'battery' },
      { cmd: 'z', label: 'users' },
      { cmd: '1', label: 'networkInterfaceDefault' },
      { cmd: '2', label: 'networkGatewayDefault' },
      { cmd: '3', label: 'networkInterfaces' },
      { cmd: '4', label: 'networkStats' },
      { cmd: '5', label: 'networkConnections' },
      { cmd: '6', label: 'dockerInfo' },
      { cmd: '7', label: 'dockerImages' },
      { cmd: '8', label: 'dockerContainers' },
      { cmd: '9', label: 'dockerContainerStats' },
      { cmd: '0', label: 'dockerContainerProcesses' },
      { cmd: '+', label: 'dockerVolumes' },
      { cmd: ',', label: 'getStaticData' },
      { cmd: '.', label: 'getDynamicData' },
      { cmd: '/', label: 'getAllData' }
    ]

    async function getSystemInfo(model: { cmd: null | string } | null) {
      if (model != null) {
        await expressApi
          .post('/v1/system/systeminfo', {
            cmd: model.cmd
          })
          .then((res) => (response.value = res))
          .catch(function (error) {
            console.log(error)
          })
      }
    }

    return {
      getSystemInfo,
      model: ref(null),
      options,
      response
    }
  }
})
</script>
