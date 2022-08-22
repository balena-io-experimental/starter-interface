<template>
  <q-btn
    v-bind="qBtnStyle"
    :label="$t('components.system.update_device.update_device')"
    @click="update()"
  />
  <q-checkbox
    v-model="isCheckBox"
    class="q-ml-md"
    dense
    size="xs"
    :label="$t('components.system.update_device.force_update')"
  />
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { supervisor } from 'src/api/supervisor'
import { qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SystemUpdateDevice',
  setup() {
    const isCheckBox = ref<boolean>(false)
    const response = ref<AxiosResponse>()
    const $q = useQuasar()

    async function update() {
      response.value = await supervisor.v1.update(isCheckBox.value)
      $q.notify({
        type: 'positive',
        message: response.value.data as string
      })
    }

    return {
      isCheckBox,
      qBtnStyle,
      update
    }
  }
})
</script>
