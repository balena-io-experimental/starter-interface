<template>
  <div class="q-mt-md">
    <q-btn
      v-bind="qBtnStyle"
      :label="$t('system.ping_supervisor')"
      @click="ping()"
    />
  </div>
  <div v-if="response">{{ $t('Response') }} {{ response.data }}</div>
</template>

<script lang="ts">
import { supervisorRequests } from '../api/SupervisorRequests'
import { AxiosResponse } from 'axios'
import { qBtnStyle } from './styles/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntPingComponent',
  setup() {
    const response = ref<AxiosResponse>()

    async function ping() {
      response.value = await supervisorRequests.ping()
    }
    return {
      ping,
      qBtnStyle,
      response
    }
  }
})
</script>
