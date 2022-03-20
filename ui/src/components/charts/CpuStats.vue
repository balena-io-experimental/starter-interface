<template>
  <div class="text-right">
    <q-toggle
      v-model="pauseToggle"
      class="q-ml-sm"
      color="secondary"
      size="xs"
      :label="$t('charts.cpu_stats.pause')"
      left-label
      @update:model-value="pause()"
    />
    <q-toggle
      v-model="coresToggle"
      color="secondary"
      size="xs"
      :label="$t('charts.cpu_stats.show_cores')"
      left-label
      @update:model-value="series = []"
    />
  </div>

  <div v-if="noData" class="text-center q-mb-md">
    {{ $t('charts.cpu_stats.no_data') }}
  </div>
  <vue-apex-charts
    v-else
    :height="props.height"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { expressApi } from 'boot/axios'
import { getCssVar, LoadingBar } from 'quasar'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'

interface cpuStat {
  data: {
    currentLoad: string
    cpus: Array<{ load: string }>
  }
}

interface series {
  [index: number]: {
    name: string
    data: Array<Array<string | number>>
  }
}

export default defineComponent({
  name: 'IntCpuStats',
  components: { VueApexCharts },
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
    const { t } = useI18n()

    // Constants
    const coresToggle = ref<boolean>(false)
    const noData = ref<boolean>(false)
    const series = ref<series>([])
    const unMounted = ref<boolean>(false)

    const chartOptions = ref({
      chart: {
        height: 'auto',
        type: 'line',
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
      colors: [
        getCssVar('primary'),
        getCssVar('secondary'),
        getCssVar('accent'),
        getCssVar('negative'),
        getCssVar('positive'),
        getCssVar('dark'),
        getCssVar('info'),
        getCssVar('warning')
      ],
      tooltip: { enabled: true },
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
        type: 'datetime',
        labels: {
          formatter: function (val: number) {
            return new Date(val).toLocaleTimeString()
          },
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
      },
      noData: {
        text: t('general.Loading'),
        align: 'center',
        verticalAlign: 'middle'
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
            // Fetch the data from the response
            const cpuStat: cpuStat = res.data

            if (!coresToggle.value) {
              if (!series.value[0]) {
                series.value[0] = {
                  name: t('charts.cpu_stats.CPU'),
                  data: [
                    [
                      new Date().getTime(),
                      parseInt(cpuStat.data.currentLoad).toFixed(0)
                    ]
                  ]
                }
              } else {
                // If there are more than X items in the object, remove one
                // to avoid it growing too big
                if (series.value[0].data.length > props.maxDataPoints) {
                  series.value[0].data.shift()
                }

                // Add the fetched data in to the chart data
                series.value[0].data.push([
                  new Date().getTime(),
                  parseInt(cpuStat.data.currentLoad).toFixed(0)
                ])
              }
            } else {
              if (cpuStat.data.cpus) {
                let i = 0
                cpuStat.data.cpus.forEach(function (value) {
                  if (!series.value[i]) {
                    series.value[i] = {
                      name: `${t('charts.cpu_stats.Core')} ${i + 1}`,
                      data: [
                        [new Date().getTime(), parseInt(value.load).toFixed(0)]
                      ]
                    }
                  } else {
                    // If there are more than X items in the object, remove one
                    // to avoid it growing too big
                    if (series.value[i].data.length > props.maxDataPoints) {
                      series.value[i].data.shift()
                    }

                    series.value[i].data.push([
                      new Date().getTime(),
                      parseInt(value.load).toFixed(0)
                    ])
                  }
                  i = i + 1
                })
              }
            }
            // Delay before calling next fetch
            await delay(props.pollInterval)
          })
          .catch(function () {
            // On error, stop the polling
            noData.value = true
            unMounted.value = true
          })
        if (unMounted.value) {
          return
        }
      }
    }

    function pause() {
      if (unMounted.value) {
        unMounted.value = false
        void fetchCpuStats()
      } else {
        unMounted.value = true
      }
    }

    return {
      chartOptions,
      coresToggle,
      noData,
      pause,
      pauseToggle: ref<boolean>(false),
      props,
      series
    }
  }
})
</script>
