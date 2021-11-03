<template>
  <q-page class="row text-center items-center justify-evenly">
    <div>
      <div>
        <q-btn
          outline
          rounded
          color="secondary"
          :label="$t('update_device')"
          @click="update()"
        />
        <div>{{ $t('update') }} <q-checkbox v-model="checkBox" /></div>
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
    const checkBox = ref<boolean>(false)
    const response = ref<any>()

    async function update () {
      response.value = await supervisorRequests.update(checkBox.value)
    }

    return {
      checkBox,
      response,
      update
    }
  }
})
</script>
