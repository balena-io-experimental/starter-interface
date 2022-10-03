<template>
  <div>
    <q-input
      v-model="newHostname"
      dense
      bottom-slots
      :label="$t('components.network.change_hostname.change_hostname')"
      counter
      maxlength="32"
    >
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
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { supervisor } from 'src/api/supervisor'
import { qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SystemChangeHostname',
  setup() {
    const response = ref<AxiosResponse>()
    const $q = useQuasar()

    async function changeHostname(newHostname: string) {
      response.value = await supervisor.v1.device_host_config_patch({
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
