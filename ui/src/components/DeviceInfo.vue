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
        {{
          response.data.is_undervolted
            ? $t('undervolted')
            : $t('not_undervolted')
        }}
      </q-chip>
    </h4>

    <div class="row items-start">

      <q-card flat bordered class="">
        <q-card-section horizontal>
          <!-- info -->
          <q-card-section>
            <q-list>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{ $t('location') }}</q-item-label>
                  <q-item-label>{{ response.data.location }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{ $t('os_version') }}</q-item-label>
                  <q-item-label>{{ response.data.os_version }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{ $t('supervisor_version') }}</q-item-label>
                  <q-item-label>{{ response.data.supervisor_version }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{ $t('ip_address') }}</q-item-label>
                  <q-item-label>{{ response.data.ip_address }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{ $t('mac_address') }}</q-item-label>
                  <q-item-label v-for="mac in response.data.mac_address.split(' ')" :key="mac">{{ mac }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{ $t('public_ip') }}</q-item-label>
                  <q-item-label>{{ response.data.public_address }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <!-- end info -->
          <q-separator vertical />
          <!-- bars -->
          <q-card-section>
            <q-card-section>
              <b class="q-mr-xs">{{ $t('memory') }}</b>
              <span> - </span>
              <span
                >{{ response.data.memory_usage }}MB /
                {{ response.data.memory_total }}MB</span
              >
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
              <span
                >{{ (response.data.storage_usage / 1000).toFixed(2) }}GB /
                {{ (response.data.storage_total / 1000).toFixed(2) }}GB</span
              >
              <q-linear-progress
                color="secondary"
                rounded
                :value="response.data.storage_usage / response.data.storage_total"
                class="q-mt-md"
              />
            </q-card-section>
          </q-card-section>
          <!-- end bars -->
        </q-card-section>
      </q-card>
    </div>
    <hr class="q-mt-xl q-mb-lg" />
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
import { sdkRequests } from '../api/SdkRequests'
import { AxiosResponse } from 'axios'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'DeviceInfoComponent',
  setup() {
    const response = ref<AxiosResponse>()

    async function getDeviceInfo() {
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
