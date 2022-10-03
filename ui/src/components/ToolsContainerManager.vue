<template>
  <div class="q-mt-sm q-ml-md q-mr-md">
    <q-table
      :title="$t('components.tools.container_manager.containers')"
      :loading="isLoading"
      flat
      dense
      :rows-per-page-options="[10, 20, 0]"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template #top-right>
        <q-btn
          icon="refresh"
          :disable="isLoading"
          v-bind="qBtnStyle"
          @click="getContainer()"
        />
      </template>
      <template #body-cell-start="props">
        <q-td auto-width>
          <q-space />
          <q-btn
            v-bind="qBtnStyle"
            icon="play_arrow"
            size="xs"
            round
            :disable="isLoading"
            @click="startContainer(props.row.serviceName)"
          />
        </q-td>
      </template>
      <template #body-cell-stop="props">
        <q-td auto-width>
          <q-space />
          <q-btn
            v-bind="qBtnStyle"
            icon="stop"
            :disable="isLoading"
            size="xs"
            round
            @click="stopContainer(props.row.serviceName)"
          />
        </q-td>
      </template>
      <template #body-cell-restart="props">
        <q-td auto-width>
          <q-space />
          <q-btn
            v-bind="qBtnStyle"
            icon="restart_alt"
            :disable="isLoading"
            size="xs"
            round
            @click="restartContainer(props.row.serviceName)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { QTableProps, useQuasar } from 'quasar'
import { supervisor } from 'src/api/supervisor'
import { qBtnStyle } from 'src/config/qStyles'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface ContainersRes extends QTableProps {
  serviceName: string
  status: string
}

export default defineComponent({
  name: 'ToolsContainerManager',
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const isLoading = ref<boolean>(true)
    const rows = ref<ContainersRes[]>()

    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'name',
        required: true,
        align: 'left',
        sortOrder: 'ad',
        label: t('general.name'),
        field: (row: ContainersRes) => row.serviceName,
        format: (val: string) => `${val}`,
        sortable: true
      },
      {
        name: 'status',
        align: 'left',
        label: t('general.status'),
        field: 'status',
        sortable: true
      },
      {
        name: 'start',
        label: t('general.start'),
        field: 'start'
      },
      {
        name: 'stop',
        label: t('general.stop'),
        field: 'stop'
      },
      {
        name: 'restart',
        label: t('general.restart'),
        field: 'restart'
      }
    ])

    onMounted(async () => {
      await getContainer()
    })

    async function getContainer() {
      isLoading.value = true

      try {
        const res = (await supervisor.v2.state_status()) as AxiosResponse<{
          containers: ContainersRes[]
        }>
        rows.value = res.data.containers
      } catch (error) {
        console.error(error)
      }

      isLoading.value = false
    }

    async function restartContainer(serviceName: string) {
      isLoading.value = true
      try {
        const res = await supervisor.v2.restart_service(serviceName)

        await getContainer()
        $q.notify({
          type: 'positive',
          message: res.data as string
        })
      } catch (error) {
        $q.notify({ type: 'negative', message: t('general.error') })
        console.error(error)
      }
      isLoading.value = false
    }

    async function startContainer(serviceName: string) {
      isLoading.value = true
      try {
        const res = await supervisor.v2.start_service(serviceName)

        await getContainer()
        $q.notify({
          type: 'positive',
          message: res.data as string
        })
      } catch (error) {
        $q.notify({ type: 'negative', message: t('general.error') })
        console.error(error)
      }
      isLoading.value = false
    }

    async function stopContainer(serviceName: string) {
      isLoading.value = true
      try {
        const res = await supervisor.v2.stop_service(serviceName)

        await getContainer()
        $q.notify({
          type: 'positive',
          message: res.data as string
        })
      } catch (error) {
        $q.notify({ type: 'negative', message: t('general.error') })
        console.error(error)
      }
      isLoading.value = false
    }

    return {
      columns,
      getContainer,
      isLoading,
      qBtnStyle,
      restartContainer,
      rows,
      startContainer,
      stopContainer
    }
  }
})
</script>
