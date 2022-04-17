<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        v-model="model"
        filled
        dense
        :loading="isLoadingRequest"
        :options="options"
        :label="$t('components.tools.system_info.select_request')"
        @update:model-value="getSystemInfo(model)"
      />
    </div>
  </div>
  <q-expansion-item
    expand-separator
    default-opened
    icon="code"
    :label="$t('components.system.device_info.response_details')"
    :caption="$t('components.system.device_info.raw_json')"
  >
    <pre v-if="response">{{ response.data }}</pre>
  </q-expansion-item>
</template>

<script lang="ts">
import { expressApi } from 'boot/axios'
import { AxiosResponse } from 'axios'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ToolsSystemInfo',
  setup() {
    const isLoadingRequest = ref<boolean>(false)
    const response = ref<AxiosResponse>()

    const options = [
      { cmd: 'a', label: 'Audio' },
      { cmd: 'B', label: 'Baseboard' },
      { cmd: 'Y', label: 'Battery' },
      { cmd: 'b', label: 'Bios' },
      { cmd: 'e', label: 'Block Devices' },
      { cmd: 'h', label: 'Bluetooth Devices' },
      { cmd: 'C', label: 'Chassis' },
      { cmd: 'c', label: 'CPU' },
      { cmd: 'j', label: 'CPU CurrentSpeed' },
      { cmd: 'T', label: 'CPU Temperature' },
      { cmd: 'l', label: 'Current Load' },
      { cmd: 'd', label: 'Disk Layout' },
      { cmd: 'D', label: 'Disks IO' },
      { cmd: '0', label: 'Docker Container Processes' },
      { cmd: '8', label: 'Docker Containers' },
      { cmd: '9', label: 'Docker Container Stats' },
      { cmd: '7', label: 'Docker Images' },
      { cmd: '6', label: 'Docker Info' },
      { cmd: '+', label: 'Docker Volumes' },
      { cmd: 'E', label: 'Fs Open Files' },
      { cmd: 'f', label: 'Fs Size' },
      { cmd: 'F', label: 'Fs Stats' },
      { cmd: 'L', label: 'Full Load' },
      { cmd: '/', label: 'Get All Data' },
      { cmd: '.', label: 'Get Dynamic Data' },
      { cmd: ',', label: 'Get Static Data' },
      { cmd: 'g', label: 'Graphics' },
      { cmd: 'I', label: 'Inet Check Site' },
      { cmd: 'i', label: 'Inet Latency' },
      { cmd: 'm', label: 'Mem' },
      { cmd: 'M', label: 'Mem Layout' },
      { cmd: '5', label: 'Network Connections' },
      { cmd: '2', label: 'Network Gateway Default' },
      { cmd: '1', label: 'Network Interface Default' },
      { cmd: '3', label: 'Network Interfaces' },
      { cmd: '4', label: 'Network Stats' },
      { cmd: 'o', label: 'Os Info' },
      { cmd: 'r', label: 'Printer' },
      { cmd: 'p', label: 'Processes' },
      { cmd: 'P', label: 'ProcessLoad' },
      { cmd: 's', label: 'Services' },
      { cmd: 'S', label: 'Shell' },
      { cmd: 'y', label: 'System' },
      { cmd: 'w', label: 'Temwifi Networksp' },
      { cmd: 'u', label: 'USB' },
      { cmd: 'z', label: 'Users' },
      { cmd: 'U', label: 'UUID' },
      { cmd: 'V', label: 'VBox Info' },
      { cmd: 'v', label: 'Versions' },
      { cmd: 'x', label: 'Wifi Connections' },
      { cmd: 'W', label: 'Wifi Interfaces' }
    ]

    async function getSystemInfo(model: { cmd: string } | null) {
      if (model != null) {
        isLoadingRequest.value = true
        try {
          const res = await expressApi.post('/v1/system/systeminfo', {
            cmd: model.cmd
          })

          response.value = res
        } catch {
          isLoadingRequest.value = false
        }
      }
      isLoadingRequest.value = false
    }

    return {
      getSystemInfo,
      isLoadingRequest,
      model: ref(null),
      options,
      response
    }
  }
})
</script>
