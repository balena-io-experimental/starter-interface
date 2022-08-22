<!-- eslint-disable @intlify/vue-i18n/no-raw-text */ -->
<template>
  <div v-if="response && systemStore.internetConnectivity">
    <h4 class="row items-end q-mt-none q-mb-md">
      <span class="q-mr-sm">{{ response.data.device_name }}</span>
      <q-chip
        :color="response.data.is_online ? 'positive' : 'negative'"
        text-color="white"
      >
        {{
          response.data.is_online
            ? $t('components.system.device_info.cloudlink')
            : $t('components.system.device_info.offline')
        }}
      </q-chip>
      <q-chip
        :color="response.data.is_undervolted ? 'negative' : 'positive'"
        text-color="white"
      >
        {{
          response.data.is_undervolted
            ? $t('components.system.device_info.undervolted')
            : $t('components.system.device_info.not_undervolted')
        }}
      </q-chip>
    </h4>
    <div class="q-mb-sm">
      <cpu-stats />
    </div>
    <div class="row items-start">
      <q-card flat bordered class="">
        <q-card-section horizontal>
          <!-- info -->
          <q-card-section>
            <q-list>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.location') }}
                  </q-item-label>
                  <q-item-label>{{ response.data.location }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.os_version') }}
                  </q-item-label>
                  <q-item-label>{{ response.data.os_version }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.supervisor_version') }}
                  </q-item-label>
                  <q-item-label>
                    {{ response.data.supervisor_version }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.ip_address') }}
                  </q-item-label>
                  <q-item-label>{{ response.data.ip_address }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.mac_address') }}
                  </q-item-label>
                  <q-item-label
                    v-for="mac in response.data.mac_address.split(' ')"
                    :key="mac"
                  >
                    {{ mac }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-mb-sm">
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('components.system.device_info.public_ip') }}
                  </q-item-label>
                  <q-item-label>
                    {{ response.data.public_address }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <!-- end info -->
          <q-separator vertical />
          <!-- bars -->
          <q-card-section>
            <q-card-section>
              <b class="q-mr-xs">{{
                $t('components.system.device_info.memory')
              }}</b>
              <span> - </span>
              <span
                >{{ response.data.memory_usage }}MB /
                {{ response.data.memory_total }}MB</span
              >
              <q-linear-progress
                rounded
                :value="response.data.memory_usage / response.data.memory_total"
                class="q-mt-md"
              />
            </q-card-section>
            <q-card-section>
              <b class="q-mr-xs">{{
                $t('components.system.device_info.storage')
              }}</b>
              <span>({{ response.data.storage_block_device }})</span>
              <span> - </span>
              <span
                >{{ (response.data.storage_usage / 1000).toFixed(2) }}GB /
                {{ (response.data.storage_total / 1000).toFixed(2) }}GB</span
              >
              <q-linear-progress
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
      :label="$t('components.system.device_info.response_details')"
      :caption="$t('components.system.device_info.raw_json')"
    >
      <pre style="white-space: pre-wrap">{{ response.data }}</pre>
    </q-expansion-item>
  </div>
  <div v-if="!isLoading && systemStore.internetConnectivity === false">
    {{ $t('components.system.device_info.internet_required') }}
  </div>
  <div v-if="isLoading" class="window-height row justify-center items-center">
    <q-spinner v-bind="qSpinnerStyle" />
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import CpuStats from 'components/ChartsCpuStats.vue'
import { useQuasar } from 'quasar'
import { sdk } from 'src/api/sdk'
import { qSpinnerStyle } from 'src/config/qStyles'
import { useSystemStore } from 'stores/system'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SystemDeviceInfo',
  components: { CpuStats },
  setup() {
    const $q = useQuasar()
    const systemStore = useSystemStore()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const isLoading = ref<boolean>(true)
    const response = ref<AxiosResponse>()

    async function getDeviceInfo() {
      try {
        const res = await sdk.device()
        response.value = res
      } catch (error) {
        console.error(error)
        $q.notify({
          type: 'negative',
          message: t('components.system.device_info.sdk_unavailable')
        })
      }
    }

    onMounted(async () => {
      await getDeviceInfo()
      isLoading.value = false
    })

    return {
      isLoading,
      qSpinnerStyle,
      response,
      systemStore
    }
  }
})
</script>
