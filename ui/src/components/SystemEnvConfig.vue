<template>
  <div v-if="getEnvResponse">
    <div class="row items-center q-mb-md">
      <q-icon class="q-mr-sm" name="warning" color="warning" size="1rem" />
      <span>{{
        $t('components.system.env_config.env_var_warning_message')
      }}</span>
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
            :label="$t('components.system.env_config.delete_selected_records')"
            icon="delete"
            v-bind="qBtnStyle"
            @click="deleteEnv()"
          />
        </div>
        <div>
          <q-btn
            :label="$t('components.system.env_config.add_change_env_var')"
            icon="add"
            v-bind="qBtnStyle"
            @click="isNewVarDialogOpen = true"
          />
        </div>
        <q-dialog v-model="isNewVarDialogOpen" persistent>
          <q-card style="min-width: 250px">
            <q-card-section>
              <div class="text-h6">
                {{ $t('components.system.env_config.add_change_env_var') }}
              </div>
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
                :label="$t('general.submit')"
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
      :label="$t('components.system.env_config.response_details')"
      :caption="$t('components.system.env_config.raw_json')"
    >
      <pre>{{ getEnvResponse.data }}</pre>
    </q-expansion-item>
  </div>
  <div v-if="isLoading" class="text-center">
    <q-spinner color="primary" size="3em" />
  </div>
</template>

<script lang="ts">
import { sdk } from 'src/api/sdk'
import { AxiosError, AxiosResponse } from 'axios'
import { QTableProps } from 'quasar'
import { defineComponent, ref, onMounted } from 'vue'
import { qBtnStyle } from 'src/config/qStyles'

interface Env {
  [key: string]: string
}

export default defineComponent({
  name: 'SystemEnvConfig',

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
    const isNewVarDialogOpen = ref<boolean>(false)

    const isLoading = ref<boolean>(true)

    const getEnvResponse = ref<AxiosResponse>()

    async function getEnv() {
      getEnvResponse.value = await sdk.getEnv()
    }

    function deleteEnv() {
      const toDelete: Env = {}
      selectedRows.value.forEach((item: Env) => {
        toDelete[item.name] = ''
      })
      sdk
        .deleteEnv(toDelete)
        .then(async () => {
          await getEnv()
          selectedRows.value = []
          isLoading.value = false
        })
        .catch((error: Error | AxiosError) => {
          console.error('deleteEnv', error)
          selectedRows.value = []
          isLoading.value = false
        })
    }

    function setEnv() {
      isNewVarDialogOpen.value = false
      isLoading.value = true

      sdk
        .setEnv(newVarKey.value, newVarValue.value)
        .then(async () => {
          await getEnv()
          isLoading.value = false
        })
        .catch((error: Error | AxiosError) => {
          console.error('setEnv', error)
          isLoading.value = false
        })
      newVarKey.value = ''
      newVarValue.value = ''
    }

    onMounted(async () => {
      await getEnv().catch((error: Error | AxiosError) => {
        console.error('getEnv', error)
      })
      isLoading.value = false
    })

    return {
      columns,
      deleteEnv,
      getEnvResponse,
      isLoading,
      isNewVarDialogOpen,
      newVarKey,
      newVarValue,
      qBtnStyle,
      selectedRows,
      setEnv
    }
  }
})
</script>
