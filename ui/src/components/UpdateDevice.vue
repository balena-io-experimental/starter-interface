<template>
  <div>
    <div>
      <q-btn
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
import { defineComponent, ref } from 'vue'
import { supervisorRequests } from '../axios/SupervisorRequests'

const checkBox = ref<boolean>(false)
const response = ref<any>()

async function update () {
  response.value = await supervisorRequests.update(checkBox.value)
}

export default defineComponent({
  name: 'UpdateDeviceComponent',
  setup () {
    return { checkBox, response, update }
  }
})
</script>
