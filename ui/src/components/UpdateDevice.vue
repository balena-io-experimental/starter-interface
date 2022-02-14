<template>
  <div>
    <div>
      <q-btn
        v-bind="qBtnStyle"
        :label="$t('update_device')"
        @click="update()"
      />
      <div>Will not work when device is in development mode</div>
      <div>{{ $t('force') }} <q-checkbox v-model="checkBox" /></div>
    </div>
    <div v-if="response">
      {{ response.data }}
    </div>
  </div>
</template>

<script lang="ts">
import { supervisorRequests } from '../api/SupervisorRequests'
import { AxiosResponse } from 'axios'
import { qBtnStyle } from './styles/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntUpdateDeviceComponent',
  setup() {
    const checkBox = ref<boolean>(false)
    const response = ref<AxiosResponse>()

    async function update() {
      response.value = await supervisorRequests.update(checkBox.value)
    }
    return {
      checkBox,
      qBtnStyle,
      response,
      update
    }
  }
})
</script>
