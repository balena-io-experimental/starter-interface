<template>
  <q-page class="row text-center items-center justify-evenly">
    <div>
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
              round
              dense
              flat
              icon="send"
              @click="changeHostname(newHostname)"
            />
          </template>
        </q-input>
      </div>
      <div class="q-mt-md">
        <q-btn
          outline
          rounded
          color="secondary"
          :label="$t('ping_supervisor')"
          @click="ping()"
        />
      </div>
      <div v-if="response">
        {{ $t('Response') }} {{ response.data }}
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

    async function changeHostname (newHostname: string) {
      response.value = await supervisorRequests.host_config(newHostname)
    }

    async function ping () {
      response.value = await supervisorRequests.ping()
    }

    return {
      changeHostname,
      newHostname: ref<string>(''),
      ping,
      response
    }
  }
})
</script>
