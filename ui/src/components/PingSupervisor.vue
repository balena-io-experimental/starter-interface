<template>
  <div class="q-mt-md">
    <q-btn
      :label="$t('ping_supervisor')"
      @click="ping()"
    />
  </div>
  <div v-if="response">
    {{ $t('Response') }} {{ response.data }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { supervisorRequests } from '../axios/SupervisorRequests'

export default defineComponent({
  name: 'PingComponent',
  setup () {
    const response = ref<any>()

    async function ping () {
      response.value = await supervisorRequests.ping()
    }
    return {
      ping,
      response
    }
  }
})
</script>
