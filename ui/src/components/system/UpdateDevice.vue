<template>
  <q-btn
    v-bind="qBtnStyle"
    :label="$t('components.system.update_device.update_device')"
    @click="update()"
  />
  <q-checkbox
    v-model="checkBox"
    class="q-ml-md"
    size="xs"
    :label="$t('components.system.update_device.force_update')"
  />
</template>

<script lang="ts">
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'components/styles/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntUpdateDeviceComponent',
  setup() {
    const checkBox = ref<boolean>(false)
    const response = ref<AxiosResponse>()
    const $q = useQuasar()

    async function update() {
      response.value = await supervisorRequests.update(checkBox.value)
      $q.notify({
        type: 'positive',
        message: response.value.data as string
      })
    }

    return {
      checkBox,
      qBtnStyle,
      update
    }
  }
})
</script>
