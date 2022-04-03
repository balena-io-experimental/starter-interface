<!-- eslint-disable @intlify/vue-i18n/no-raw-text */ -->
<template>
  <div v-if="response && internetConnectivity.status">
    <h4 class="row items-end q-mt-none q-mb-md">
      <span class="q-mr-sm">{{ response.data.device_name }}</span>
      <q-chip
        :color="response.data.is_online ? 'positive' : 'negative'"
        text-color="white"
      >
        {{ response.data.is_online ? $t('wifi.online') : $t('wifi.offline') }}
      </q-chip>
      <q-chip
        :color="response.data.is_undervolted ? 'negative' : 'positive'"
        text-color="white"
      >
        {{
          response.data.is_undervolted
            ? $t('device_info.undervolted')
            : $t('device_info.not_undervolted')
        }}
      </q-chip>
    </h4>
    <div class="q-mb-sm"><cpu-stats /></div>
    <div class="row items-start">
      <q-card flat bordered class="">
        <q-card-section horizontal>
          <!-- info -->
          <q-card-section>
            <q-list>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('device_info.location')
                  }}</q-item-label>
                  <q-item-label>{{ response.data.location }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('device_info.os_version')
                  }}</q-item-label>
                  <q-item-label>{{ response.data.os_version }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('device_info.supervisor_version')
                  }}</q-item-label>
                  <q-item-label>{{
                    response.data.supervisor_version
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('device_info.ip_address')
                  }}</q-item-label>
                  <q-item-label>{{ response.data.ip_address }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>{{
                    $t('device_info.mac_address')
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
                    $t('device_info.public_ip')
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
              <b class="q-mr-xs">{{ $t('device_info.memory') }}</b>
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
              <b class="q-mr-xs">{{ $t('device_info.storage') }}</b>
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
      :label="$t('device_info.response_details')"
      :caption="$t('device_info.raw_json')"
    >
      <pre>{{ response.data }}</pre>
    </q-expansion-item>
  </div>
  <div v-if="!loading && internetConnectivity.status === false">
    {{ $t('system.internet_required') }}
  </div>
  <div v-if="loading" class="window-height row justify-center items-center">
    <q-spinner color="primary" size="5em" />
  </div>
</template>

<script lang="ts">
import { sdkRequests } from 'src/api/SdkRequests'
import { AxiosResponse } from 'axios'
import CpuStats from 'components/charts/CpuStats.vue'
import { useQuasar } from 'quasar'
import { internetConnectivity } from 'src/api/SystemRequests'
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IntDeviceInfoComponent',
  components: { CpuStats },
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const loading = ref<boolean>(true)
    const response = ref<AxiosResponse>()

    async function getDeviceInfo() {
      try {
        const res = await sdkRequests.device()
        response.value = res
      } catch (error) {
        console.error(error)
        $q.notify({
          type: 'negative',
          message: t('device_info.sdk_unavailable')
        })
      }
    }

    onMounted(async () => {
      await getDeviceInfo()
      loading.value = false
    })

    return {
      internetConnectivity,
      loading,
      response
    }
  }
})
</script>
