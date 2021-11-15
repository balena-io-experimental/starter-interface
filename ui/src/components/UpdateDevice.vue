<template>
  <div>
    <div>
      <q-btn
        v-bind="btnConfig"
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
import btnConfig from '../components/qBtn'
import { defineComponent, ref } from 'vue'
import { supervisorRequests } from '../axios/SupervisorRequests'

export default defineComponent({
  name: 'UpdateDeviceComponent',
  setup () {
    const checkBox = ref<boolean>(false)
    const response = ref<any>()

    async function update () {
      response.value = await supervisorRequests.update(checkBox.value)
    }
    return {
      btnConfig,
      checkBox,
      response,
      update
    }
  }
})
</script>
