<template>
  <LineChart
    :chart-data="chartData"
    :options="options"
    :height="props.height"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { LineChart } from 'vue-chart-3'
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js'
import { getCssVar, LoadingBar } from 'quasar'
import { AxiosResponse } from 'axios'
import { expressApi } from 'boot/axios'
import { useI18n } from 'vue-i18n'

interface cpuStat {
  data: {
    currentLoad: number
    cpus: Array<{ load: string }>
  }
}

Chart.register(...registerables)

export default defineComponent({
  name: 'IntCpuStats',
  components: { LineChart },
  props: {
    height: {
      type: Number,
      default: 150
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
    const chartHeight = 150
    const unMounted = ref<boolean>(false)

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

    const chartData = ref<ChartData<'line'>>({
      labels: [0],
      datasets: [
        {
          backgroundColor: getCssVar('primary') as string,
          data: [0]
        }
      ]
    })

    const options = ref<ChartOptions<'line'>>({
      animation: {
        duration: 0
      },
      elements: {
        point: {
          radius: 0
        }
      },
      responsive: true,
      scales: {
        yAxis: {
          min: 0,
          max: 100,
          display: true
        },
        xAxis: {
          display: false
        }
      },

      plugins: {
        title: {
          display: true,
          align: 'start',
          text: t('components.charts.cpu_stats.cpu_status'),
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          enabled: false
        },
        legend: {
          display: false
        }
      }
    })

    // Functions
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async function fetchCpuStats() {
      for (;;) {
        try {
          const cpuStat: AxiosResponse<cpuStat> = await expressApi.post(
            '/v1/system/systeminfo',
            {
              cmd: 'l'
            }
          )

          // If there are more than X items in the object, remove one
          // to avoid it growing too big
          if (chartData.value.datasets[0].data.length > props.maxDataPoints) {
            chartData?.value?.labels?.shift()
            chartData.value.datasets[0].data.shift()
          }

          // Add the fetched data in to the chart
          chartData?.value?.labels?.push(
            new Date(new Date().getTime()).toLocaleTimeString()
          )
          chartData.value.datasets[0].data.push(cpuStat.data.data.currentLoad)

          if (cpuStat.data.data.currentLoad > 50) {
            chartData.value.datasets[0].borderColor = getCssVar(
              'warning'
            ) as string
          } else if (cpuStat.data.data.currentLoad > 80) {
            chartData.value.datasets[0].borderColor = getCssVar(
              'negative'
            ) as string
          } else {
            chartData.value.datasets[0].borderColor = getCssVar(
              'primary'
            ) as string
          }
        } catch (err) {
          unMounted.value = true
          console.error(err)
        }

        if (unMounted.value === true) {
          break
        }

        // Delay before calling next fetch
        await delay(props.pollInterval)
      }
    }

    return { chartData, chartHeight, options, props }
  }
})
</script>
