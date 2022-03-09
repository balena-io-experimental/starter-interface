<template>
  <div v-if="noData" class="text-center">
    {{ $t('charts.cpu_stats.no_data') }}
  </div>
  <apexchart
    v-else
    :height="props.height"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { expressApi } from 'boot/axios'
import { getCssVar } from 'quasar'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LoadingBar } from 'quasar'

interface cpuStat {
  data: {
    currentLoad: number
  }
}

interface series {
  [index: number]: {
    name: string
    data: Array<string>
  }
}

export default defineComponent({
  name: 'IntCpuStats',
  props: {
    height: {
      type: Number,
      default: 175
    },
    maxDataPoints: {
      type: Number,
      default: 20
    },
    pollInterval: {
      type: Number,
      default: 1500
    }
  },
  setup(props) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    // Constants
    const noData = ref<boolean>(false)
    const series = ref<series>([{ name: 'CPU', data: ['0'] }])
    const unMounted = ref<boolean>(false)

    const chartOptions = ref({
      chart: {
        height: 'auto',
        type: 'area',
        tooltip: {
          enabled: false
        },
        animations: {
          enabled: false
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: [getCssVar('primary')],
      tooltip: { enabled: false },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      title: {
        text: t('charts.cpu_stats.cpu_status'),
        align: 'left'
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'category',
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          formatter: function (val: number) {
            return `${val}%`
          },
          show: true
        }
      },
      legend: {
        show: false
      }
    })

    onMounted(() => {
      // Disables the AJAX loading bar at the bottom of the page for polled system info requests
      LoadingBar.setDefaults({
        hijackFilter(url: string) {
          return !url.includes('systeminfo')
        }
      })

      // Start the polling
      void fetchCpuStats()
    })

    onUnmounted(() => {
      // Re-enables the AJAX loading bar at the bottom of the page for system info requests
      LoadingBar.setDefaults({
        hijackFilter() {
          return true
        }
      })

      // Instructs to exit the running poll loop, because this component is no longer visible
      unMounted.value = true
    })

    // Functions
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async function fetchCpuStats() {
      for (;;) {
        await expressApi
          .post<AxiosResponse>('/v1/system/systeminfo', {
            cmd: 'l'
          })
          .then(async (res) => {
            // If there are more than 20 items in the object, remove one
            // to avoid it growing to big
            if (series.value[0].data.length > props.maxDataPoints) {
              series.value[0].data.shift()
            }

            // Fetch the data from the response
            const cpuStat: cpuStat = res.data
            // Add the fetched data in to the chart data
            series.value[0].data.push(cpuStat.data.currentLoad.toFixed(0))

            // Delay before calling next fetch
            await delay(props.pollInterval)
          })
          .catch(function (err) {
            console.log(err)

            // On error, stop the polling
            noData.value = true
            unMounted.value = true
          })
        if (unMounted.value) {
          return
        }
      }
    }

    return {
      chartOptions,
      noData,
      props,
      series
    }
  }
})
</script>
