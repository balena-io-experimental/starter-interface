<template>
  <div v-if="getEnvResponse">
    <div class="row items-center q-mb-md">
      <q-icon class="q-mr-sm" name="warning" color="warning" size="1rem" />
      <span>{{ $t('system.env_var_warning_message') }}</span>
    </div>
    <div class="q-mt-none q-mb-lg">
      <q-table
        v-model:selected="selectedRows"
        flat
        :dense="$q.screen.gt.sm"
        separator="cell"
        :rows="getEnvResponse.data"
        :columns="columns"
        row-key="name"
        selection="multiple"
        :rows-per-page-options="[5, 10, 50, 0]"
      />
      <div class="q-pa-md q-gutter-y-md column items-start">
        <div v-if="selectedRows.length > 0">
          <q-btn
            :label="$t('system.delete_selected_records')"
            icon="delete"
            v-bind="qBtnStyle"
            @click="deleteEnv()"
          />
        </div>
        <div>
          <q-btn
            :label="$t('system.add_change_env_var')"
            icon="add"
            v-bind="qBtnStyle"
            @click="newVarDialogOpen = true"
          />
        </div>
        <q-dialog v-model="newVarDialogOpen" persistent>
          <q-card style="min-width: 250px">
            <q-card-section>
              <div class="text-h6">{{ $t('system.add_change_env_var') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                v-model="newVarKey"
                label="Key"
                stack-label
                dense
                autofocus
              />
              <q-input v-model="newVarValue" label="Value" stack-label dense />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn
                v-close-popup
                v-bind="qBtnStyle"
                :label="$t('general.cancel')"
              />
              <q-btn
                :label="$t('general.Submit')"
                v-bind="qBtnStyle"
                @click="setEnv()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
    <q-expansion-item
      expand-separator
      icon="code"
      :label="$t('device_info.response_details')"
      :caption="$t('device_info.raw_json')"
    >
      <pre>{{ getEnvResponse.data }}</pre>
    </q-expansion-item>
  </div>
  <div v-if="loading" class="text-center">
    <q-spinner color="primary" size="3em" />
  </div>
</template>

<script lang="ts">
import { sdkRequests } from 'src/api/SdkRequests'
import { AxiosError, AxiosResponse } from 'axios'
import { QTableProps } from 'quasar'
import { defineComponent, ref, onMounted } from 'vue'
import { qBtnStyle } from 'components/styles/qStyles'

interface Env {
  [key: string]: string
}

export default defineComponent({
  name: 'IntEnvConfigComponent',

  setup() {
    const selectedRows = ref([])
    const columns: QTableProps['columns'] = [
      {
        name: 'name',
        style: 'width: 200px',
        align: 'left',
        label: 'Name',
        field: 'name',
        sortable: true
      },
      {
        name: 'value',
        align: 'left',
        label: 'Value',
        field: 'value',
        sortable: true
      }
    ]

    const newVarKey = ref<string>('')
    const newVarValue = ref<string>('')
    const newVarDialogOpen = ref<boolean>(false)

    const loading = ref<boolean>(true)

    const getEnvResponse = ref<AxiosResponse>()

    async function getEnv() {
      getEnvResponse.value = await sdkRequests.getEnv()
    }

    function deleteEnv() {
      var toDelete: Env = {}
      selectedRows.value.forEach((item: Env) => {
        toDelete[item.name] = ''
      })
      sdkRequests
        .deleteEnv(toDelete)
        .then(async function () {
          await getEnv()
          selectedRows.value = []
          loading.value = false
        })
        .catch(function (error: Error | AxiosError) {
          console.error('deleteEnv', error)
          selectedRows.value = []
          loading.value = false
        })
    }

    function setEnv() {
      newVarDialogOpen.value = false
      loading.value = true

      sdkRequests
        .setEnv(newVarKey.value, newVarValue.value)
        .then(async function () {
          await getEnv()
          loading.value = false
        })
        .catch(function (error: Error | AxiosError) {
          console.error('setEnv', error)
          loading.value = false
        })
      newVarKey.value = ''
      newVarValue.value = ''
    }

    onMounted(async () => {
      await getEnv().catch(function (error: Error | AxiosError) {
        console.error('getEnv', error)
      })
      loading.value = false
    })

    return {
      columns,
      deleteEnv,
      getEnvResponse,
      loading,
      newVarDialogOpen,
      newVarKey,
      newVarValue,
      qBtnStyle,
      selectedRows,
      setEnv
    }
  }
})
</script>
