<template>
  <div class="q-mt-sm q-ml-md q-mr-md">
    <q-table
      :title="$t('containers.Containers')"
      :loading="loading"
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
          :disable="loading"
          v-bind="qBtnStyle"
          :loading="loading"
          @click="getContainer()"
        />
      </template>
      <template #body-cell-start="props">
        <q-td auto-width>
          <q-space />
          <q-btn
            icon="play_arrow"
            size="xs"
            round
            :disable="loading"
            v-bind="qBtnStyle"
            :loading="loading"
            @click="startContainer(props.row.serviceName)"
          />
        </q-td>
      </template>
      <template #body-cell-stop="props">
        <q-td auto-width>
          <q-space />
          <q-btn
            icon="stop"
            :disable="loading"
            size="xs"
            round
            v-bind="qBtnStyle"
            :loading="loading"
            @click="stopContainer(props.row.serviceName)"
          />
        </q-td>
      </template>
      <template #body-cell-restart="props">
        <q-td auto-width>
          <q-space />
          <q-btn
            icon="restart_alt"
            :disable="loading"
            size="xs"
            round
            v-bind="qBtnStyle"
            :loading="loading"
            @click="restartContainer(props.row.serviceName)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { qBtnStyle } from 'components/styles/qStyles'
import { QTableProps } from 'quasar'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

interface containers extends QTableProps {
  serviceName: string
  status: string
}

export default defineComponent({
  name: 'IntPingComponent',
  setup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()
    const $q = useQuasar()

    const loading = ref<boolean>(true)
    const rows = ref<containers[]>()
    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'name',
        required: true,
        align: 'left',
        sortOrder: 'ad',
        label: t('general.Name'),
        field: (row: containers) => row.serviceName,
        format: (val: string) => `${val}`,
        sortable: true
      },
      {
        name: 'status',
        align: 'left',
        label: t('general.Status'),
        field: 'status',
        sortable: true
      },
      {
        name: 'start',
        label: t('general.Start'),
        field: 'start'
      },
      {
        name: 'stop',
        label: t('general.Stop'),
        field: 'stop'
      },
      {
        name: 'restart',
        label: t('general.Restart'),
        field: 'restart'
      }
    ])

    onMounted(async () => {
      await getContainer()
    })

    async function getContainer() {
      loading.value = true
      await supervisorRequests
        .state_status()
        .then((res: { data: { containers: containers[] } }) => {
          rows.value = res.data.containers
        })
        .catch(function (error) {
          $q.notify({ type: 'negative', message: t('general.Error') })
          console.log(error)
        })
      loading.value = false
    }

    async function restartContainer(serviceName: string) {
      loading.value = true
      await supervisorRequests
        .restart_service(serviceName)
        .then(async (res) => {
          await getContainer()
          $q.notify({
            type: 'positive',
            message: res.data as string
          })
        })
        .catch(function (error) {
          $q.notify({ type: 'negative', message: t('general.Error') })
          console.log(error)
        })
      loading.value = false
    }

    async function startContainer(serviceName: string) {
      loading.value = true
      await supervisorRequests
        .start_service(serviceName)
        .then(async (res) => {
          await getContainer()
          $q.notify({
            type: 'positive',
            message: res.data as string
          })
        })
        .catch(function (error) {
          $q.notify({ type: 'negative', message: t('general.Error') })
          console.log(error)
        })
      loading.value = false
    }

    async function stopContainer(serviceName: string) {
      loading.value = true
      await supervisorRequests
        .stop_service(serviceName)
        .then(async (res) => {
          await getContainer()
          $q.notify({
            type: 'positive',
            message: res.data as string
          })
        })
        .catch(function (error) {
          $q.notify({ type: 'negative', message: t('general.Error') })
          console.log(error)
        })
      loading.value = false
    }

    return {
      columns,
      getContainer,
      loading,
      qBtnStyle,
      restartContainer,
      rows,
      startContainer,
      stopContainer
    }
  }
})
</script>
