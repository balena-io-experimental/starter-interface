<template>
  <q-btn
    v-bind="qBtnStyle"
    :label="$t('components.system.update_device.update_device')"
    @click="update()"
  />
  <q-checkbox
    v-model="checkBox"
    class="q-ml-md"
    dense
    size="xs"
    :label="$t('components.system.update_device.force_update')"
  />
</template>

<script lang="ts">
import { supervisor } from 'src/api/supervisor'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SystemUpdateDevice',
  setup() {
    const checkBox = ref<boolean>(false)
    const response = ref<AxiosResponse>()
    const $q = useQuasar()

    async function update() {
      response.value = await supervisor.update(checkBox.value)
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
