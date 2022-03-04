<template>
  <div class="row">
    <q-btn
      v-bind="qBtnStyle"
      :label="$t('system.ping_supervisor')"
      @click="ping()"
    />
  </div>
</template>

<script lang="ts">
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'src/components/styles/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntPingComponent',
  setup() {
    const $q = useQuasar()
    const response = ref<AxiosResponse>()

    async function ping() {
      response.value = await supervisorRequests.ping()
      $q.notify({
        type: 'positive',
        message: response.value.data as string
      })
    }
    return {
      ping,
      qBtnStyle
    }
  }
})
</script>
