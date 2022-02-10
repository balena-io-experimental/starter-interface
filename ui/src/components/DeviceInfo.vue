<template>
  <div v-if="response">
    <h4 class="row items-end q-mt-none q-mb-lg">
      <span class="q-mr-sm">{{ response.data.device_name }}</span>
      <q-chip
        :color="response.data.is_online ? 'green' : 'red'"
        text-color="white"
      >
        {{ response.data.is_online ? $t('online') : $t('offline') }}
      </q-chip>
      <q-chip
        :color="response.data.is_undervolted ? 'red' : 'green'"
        text-color="white"
      >
        {{ response.data.is_undervolted ? $t('undervolted') : $t('not_undervolted') }}
      </q-chip>
    </h4>

    <div class="row">
      <q-card class="col-xs-12 col-sm-6 col-md-3 col-lg-4">
        <q-card-section>
          <b class="q-mr-xs">{{ $t('memory') }}</b>
          <span> - </span>
          <span>{{ response.data.memory_usage }}MB / {{ response.data.memory_total }}MB</span>
          <q-linear-progress
            color="secondary"
            rounded
            :value="response.data.memory_usage / response.data.memory_total"
            class="q-mt-md"
          />
        </q-card-section>
        <q-card-section>
          <b class="q-mr-xs">{{ $t('storage') }}</b>
          <span>({{ response.data.storage_block_device }})</span>
          <span> - </span>
          <span>{{ (response.data.storage_usage / 1000).toFixed(2) }}GB / {{ (response.data.storage_total / 1000).toFixed(2) }}GB</span>
          <q-linear-progress
            color="secondary"
            rounded
            :value="response.data.storage_usage / response.data.storage_total"
            class="q-mt-md"
          />
        </q-card-section>
      </q-card>
    </div>
    <hr class="q-mt-xl q-mb-lg">
    <q-expansion-item
      expand-separator
      icon="code"
      :label="$t('response_details')"
      :caption="$t('raw_json')"
    >
      <pre>{{ response.data }}</pre>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { sdkRequests } from '../axios/SdkRequests'

export default defineComponent({
  name: 'DeviceInfoComponent',
  setup () {
    const response = ref<any>()

    async function getDeviceInfo () {
      response.value = await sdkRequests.device()
    }

    onMounted(async () => {
      await getDeviceInfo()
    })

    return {
      response
    }
  }
})
</script>
