<!-- eslint-disable @intlify/vue-i18n/no-raw-text */ -->
<template>
  <div v-if="response">
    <h4 class="row items-end q-mt-none q-mb-lg">
      <span class="q-mr-sm">{{ response.data.device_name }}</span>
      <q-chip
        :color="response.data.is_online ? 'green' : 'red'"
        text-color="white"
      >
        {{ response.data.is_online ? $t('wifi.online') : $t('wifi.offline') }}
      </q-chip>
      <q-chip
        :color="response.data.is_undervolted ? 'red' : 'green'"
        text-color="white"
      >
        {{
          response.data.is_undervolted
            ? $t('deviceInfo.undervolted')
            : $t('deviceInfo.not_undervolted')
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
                  <q-item-label caption>{{
                    $t('deviceInfo.location')
                  }}</q-item-label>
                  <q-item-label>{{ response.data.location }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.os_version')
                  }}</q-item-label>
                  <q-item-label>{{ response.data.os_version }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.supervisor_version')
                  }}</q-item-label>
                  <q-item-label>{{
                    response.data.supervisor_version
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.ip_address')
                  }}</q-item-label>
                  <q-item-label>{{ response.data.ip_address }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.mac_address')
                  }}</q-item-label>
                  <q-item-label
                    v-for="mac in response.data.mac_address.split(' ')"
                    :key="mac"
                    >{{ mac }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('deviceInfo.public_ip')
                  }}</q-item-label>
                  <q-item-label>{{
                    response.data.public_address
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <!-- end info -->
          <q-separator vertical />
          <!-- bars -->
          <q-card-section>
            <q-card-section>
              <b class="q-mr-xs">{{ $t('deviceInfo.memory') }}</b>
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
              <b class="q-mr-xs">{{ $t('deviceInfo.storage') }}</b>
              <span>({{ response.data.storage_block_device }})</span>
              <span> - </span>
              <span
                >{{ (response.data.storage_usage / 1000).toFixed(2) }}GB /
                {{ (response.data.storage_total / 1000).toFixed(2) }}GB</span
              >
              <q-linear-progress
                color="secondary"
                rounded
                :value="
                  response.data.storage_usage / response.data.storage_total
                "
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
      :label="$t('deviceInfo.response_details')"
      :caption="$t('deviceInfo.raw_json')"
    >
      <pre>{{ response.data }}</pre>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { sdkRequests } from '../api/SdkRequests'
import { AxiosError, AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'DeviceInfoComponent',
  setup() {
    const $q = useQuasar()
    const response = ref<AxiosResponse>()

    async function getDeviceInfo() {
      await sdkRequests
        .device()
        .then((res: AxiosResponse) => {
          response.value = res
        })
        .catch(function (error: Error | AxiosError) {
          console.log(error)
        })
    }

    onMounted(async () => {
      $q.loading.show()
      await getDeviceInfo()
      $q.loading.hide()
    })

    return {
      response
    }
  }
})
</script>
