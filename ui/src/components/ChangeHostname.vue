<template>
  <div>
    <q-input
      v-model="newHostname"
      bottom-slots
      :label="$t('system.change_hostname')"
      counter
      maxlength="32"
    >
      {{ newHostname }}
      <template #after>
        <q-btn
          v-bind="qBtnStyle"
          icon="send"
          @click="changeHostname(newHostname)"
        />
      </template>
    </q-input>
    <div v-if="response">{{ $t('Response') }} {{ response.data }}</div>
  </div>
</template>

<script lang="ts">
import { supervisorRequests } from '../api/SupervisorRequests'
import { AxiosResponse } from 'axios'
import { qBtnStyle } from './styles/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntChangeHostnameComponent',
  setup() {
    const response = ref<AxiosResponse>()

    async function changeHostname(newHostname: string) {
      response.value = await supervisorRequests.device_host_config_patch({
        network: { hostname: newHostname }
      })
    }
    return {
      changeHostname,
      newHostname: ref<string>(''),
      qBtnStyle,
      response
    }
  }
})
</script>
