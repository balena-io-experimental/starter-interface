<template>
  <div>
    <q-input
      v-model="newHostname"
      bottom-slots
      :label="$t('change_hostname')"
      counter
      maxlength="32"
    >
      {{ newHostname }}
      <template #after>
        <q-btn
          v-bind="qBtnConfig"
          icon="send"
          @click="changeHostname(newHostname)"
        />
      </template>
    </q-input>
    <div v-if="response">
      {{ $t('Response') }} {{ response.data }}
    </div>
  </div>
</template>

<script lang="ts">
import qBtnConfig from '../components/styles/qBtnConfig'
import { defineComponent, ref } from 'vue'
import { supervisorRequests } from '../axios/SupervisorRequests'

export default defineComponent({
  name: 'IntChangeHostnameComponent',
  setup () {
    const response = ref<any>()

    async function changeHostname (newHostname: string) {
      response.value = await supervisorRequests.host_config(newHostname)
    }
    return {
      qBtnConfig,
      changeHostname,
      newHostname: ref<string>(''),
      response
    }
  }
})
</script>
