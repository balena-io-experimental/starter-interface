<template>
  <div class="col">
    <div>
      <DoughnutChart
        :chart-data="chartData"
        :options="options"
        :height="props.dimensions"
        :width="props.dimensions"
      />
    </div>
    <div class="text-center">
      {{ memOfTotal }}
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse } from 'axios'
import {
  ArcElement,
  Chart,
  ChartData,
  ChartOptions,
  DoughnutController,
  Title,
  Tooltip
} from 'chart.js'
import { getCssVar, LoadingBar } from 'quasar'
import { axiosSettings } from 'stores/system'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { DoughnutChart } from 'vue-chart-3'
import { useI18n } from 'vue-i18n'

interface MemStatReq {
  data: {
    available: number
    total: number
  }
}

Chart.register(ArcElement, DoughnutController, Title, Tooltip)

export default defineComponent({
  name: 'ChartsMemoryStats',
  components: { DoughnutChart },
  props: {
    dimensions: {
      type: Number,
      default: 125
    },
    pollInterval: {
      type: Number,
      default: 8000
    }
  },

  setup(props) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const axiosBaseUrl = axiosSettings()
    const isUnMounted = ref<boolean>(false)
    const memOfTotal = ref<string>()

    // Due to unstable connections, particularly on the public device URL, sometimes a poll will fail and the
    // Axios interceptor will trigger an error notification. This is a little too verbose as for polling
    // we are not significantly impacted if a poll or two fails, we just want to try again.
    const pollingApi = axios.create({
      baseURL: axiosBaseUrl.$state.axiosBaseUrl,
      timeout: 4000 // Sets a high timeout unlikely to be reached. More specific timeouts are set in the ExpressJS backend.
    })

    // Set IDs of the systeminfo service required
    const systeminfoCmdMem = 'm'

    onMounted(() => {
      // Disables the AJAX loading bar at the bottom of the page for polled system info requests
      // to avoid it flashing on each poll
      LoadingBar.setDefaults({
        hijackFilter(url: string) {
          return !url.includes('systeminfo')
        }
      })

      // Start the polling
      void fetchMemStats()
    })

    onUnmounted(() => {
      // Re-enables the AJAX loading bar at the bottom of the page for system info requests
      LoadingBar.setDefaults({
        hijackFilter() {
          return true
        }
      })

      // Instructs to exit the running poll loop, because this component is no longer visible
      isUnMounted.value = true
    })

    const chartData = ref<ChartData<'doughnut'>>({
      labels: [
        t('components.charts.mem_stats.used'),
        t('components.charts.mem_stats.available')
      ],
      datasets: [
        {
          data: [0, 100],
          backgroundColor: [getCssVar('accent') as string, '#DDE1F0']
        }
      ]
    })

    const options = ref<ChartOptions<'doughnut'>>({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          align: 'center',
          text: t('components.charts.mem_stats.memory')
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (data) =>
              ` ${data.label}: ${data.dataset.data[data.dataIndex]}%`
          }
        },
        legend: {
          display: false
        }
      }
    })

    function delay(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }

    async function fetchMemStats(): Promise<void> {
      try {
        const memStat: AxiosResponse<MemStatReq> = await pollingApi.post(
          '/v1/system/systeminfo',
          { id: systeminfoCmdMem }
        )

        const currentMemStat = (
          ((memStat.data.data.total - memStat.data.data.available) /
            memStat.data.data.total) *
          100
        ).toFixed(1) as unknown as number

        memOfTotal.value = getTotalMem(memStat)

        chartData.value.datasets[0].data = [
          currentMemStat,
          100 - currentMemStat
        ]
      } catch (error) {
        // Continuing as may have just been due to a temporary connection issue
        console.error('Error fetching memory stats')
      }

      if (!isUnMounted.value) {
        // Delay before calling next fetch
        await delay(props.pollInterval)
        void fetchMemStats()
      }
    }

    function getTotalMem(memStat: AxiosResponse<MemStatReq>) {
      const used = (
        (memStat.data.data.total - memStat.data.data.available) /
        1024 /
        1024 /
        1024
      ).toFixed(2)

      const total = (memStat.data.data.total / 1024 / 1024 / 1024).toFixed(1)

      return `${used} GB / ${total} GB`
    }

    return {
      chartData,
      memOfTotal,
      options,
      props
    }
  }
})
</script>
