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
          v-bind="btnConfig"
          icon="send"
          @click="changeHostname(newHostname)"
        />
      </template>
    </q-input>
  </div>
  <div v-if="response">
    {{ $t('Response') }} {{ response.data }}
  </div>
</template>

<script lang="ts">
import btnConfig from '../components/qBtn'
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
      btnConfig,
      changeHostname,
      newHostname: ref<string>(''),
      response
    }
  }
})
</script>
