<template>
  <q-page class="row text-center items-center justify-evenly">
    <div>
      <div>
        <q-btn
          outline
          rounded
          color="secondary"
          :label="$t('ping_supervisor')"
          @click="ping()"
        />
      </div>
      <div v-if="response">
        {{ response.data }}
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { supervisorRequests } from '../components/SupervisorRequests'

export default defineComponent({
  name: 'PageIndex',
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
