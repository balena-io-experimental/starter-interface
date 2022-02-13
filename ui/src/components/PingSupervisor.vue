<template>
  <div class="q-mt-md">
    <q-btn
      v-bind="qBtnConfig"
      :label="$t('ping_supervisor')"
      @click="ping()"
    />
  </div>
  <div v-if="response">
    {{ $t('Response') }} {{ response.data }}
  </div>
</template>

<script lang="ts">
import qBtnConfig from '../components/styles/qBtnConfig'
import { defineComponent, ref } from 'vue'
import { supervisorRequests } from '../axios/SupervisorRequests'

export default defineComponent({
  name: 'IntPingComponent',
  setup () {
    const response = ref<any>()

    async function ping () {
      response.value = await supervisorRequests.ping()
    }
    return {
      qBtnConfig,
      ping,
      response
    }
  }
})
</script>
