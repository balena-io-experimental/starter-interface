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
  </div>
</template>

<script lang="ts">
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'src/components/styles/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntChangeHostnameComponent',
  setup() {
    const response = ref<AxiosResponse>()
    const $q = useQuasar()

    async function changeHostname(newHostname: string) {
      response.value = await supervisorRequests.device_host_config_patch({
        network: { hostname: newHostname }
      })
      $q.notify({
        type: 'positive',
        message: response.value.data as string
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
