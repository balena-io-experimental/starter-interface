<template>
  <div v-if="isLoading" class="text-center">
    <q-spinner v-bind="qSpinnerStyle" size="3em" />
  </div>
  <div v-if="getEnvResponse">
    <div>
      <q-table
        v-model:selected="selectedRows"
        selection="multiple"
        class="q-mb-md"
        flat
        dense
        separator="cell"
        :rows="getEnvResponse.data"
        :columns="columns"
        :loading="isLoading"
        row-key="name"
        hide-bottom
        :rows-per-page-options="[0]"
      >
        <template #body-cell-edit="props">
          <q-td auto-width>
            <q-space />
            <q-btn
              icon="edit"
              flat
              :disable="isLoading"
              size="xs"
              round
              @click="editVar(props.row)"
            />
          </q-td>
        </template>
      </q-table>
      <q-btn
        :label="$t('components.system.env_config.add_env_var')"
        padding="0"
        no-caps
        dense
        icon="add"
        size="md"
        flat
        @click="isNewVarDialogOpen = true"
      />
      <q-btn
        :label="$t('components.system.env_config.delete_selected_records')"
        class="q-ml-md"
        icon="delete"
        padding="0"
        no-caps
        dense
        size="md"
        flat
        :disable="selectedRows.length < 1"
        @click="deleteEnv()"
      />
      <q-dialog
        v-model="isNewVarDialogOpen"
        persistent
        @hide=";(newVarKey = ''), (newVarValue = '')"
      >
        <q-card style="min-width: 250px">
          <q-card-section>
            <div class="text-h6">
              {{ $t('components.system.env_config.add_env_var') }}
            </div>
            <div class="text-caption text-grey">
              <q-icon class="q-mr-sm q-mb-xs" name="warning" color="warning" />
              {{ $t('components.system.env_config.env_var_warning_message') }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input
              ref="refNewVarKey"
              v-model="newVarKey"
              :rules="[
                (val) =>
                  (!val.includes(' ') && regexpAlphaNum.test(val)) ||
                  $t('components.system.env_config.env_rules')
              ]"
              :label="$t('components.system.env_config.key')"
              stack-label
              dense
              autofocus
            />
            <q-input
              v-model="newVarValue"
              :label="$t('components.system.env_config.value')"
              stack-label
              dense
            />
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
              :disable="!newVarValue || !newVarKey || refNewVarKey?.hasError"
              @click="setEnv()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <q-expansion-item
      class="q-mt-md"
      expand-separator
      icon="code"
      :label="$t('components.system.env_config.response_details')"
      :caption="$t('components.system.env_config.raw_json')"
    >
      <pre style="white-space: pre-wrap">{{ getEnvResponse.data }}</pre>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { sdk } from 'src/api/sdk'
import { AxiosError, AxiosResponse } from 'axios'
import { QTableProps, useQuasar } from 'quasar'
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { qBtnStyle, qSpinnerStyle } from 'src/config/qStyles'

interface Env {
  [key: string]: string
}

interface Rows extends QTableProps {
  name: string
  value: string
}

export default defineComponent({
  name: 'SystemEnvConfig',

  setup() {
    // Import required features
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const columns: QTableProps['columns'] = [
      {
        name: 'name',
        style: 'width: 200px',
        align: 'left',
        label: t('components.system.env_config.key'),
        field: 'name',
        sortable: true
      },
      {
        name: 'value',
        align: 'left',
        label: t('components.system.env_config.value'),
        field: 'value',
        sortable: true
      },
      {
        name: 'edit',
        label: t('components.system.env_config.edit'),
        field: 'edit'
      }
    ]
    const getEnvResponse = ref<AxiosResponse>()
    const isNewVarDialogOpen = ref<boolean>(false)
    const isLoading = ref<boolean>(true)
    const newVarKey = ref<string>('')
    const newVarValue = ref<string>('')
    const regexpAlphaNum = ref(/^[A-Za-z][A-Za-z0-9_]*$/)
    const selectedRows = ref([])

    onMounted(async () => {
      await getEnv().catch((error: Error | AxiosError) => {
        console.error('getEnv', error)
      })
      isLoading.value = false
    })

    function deleteEnv() {
      isLoading.value = true
      const toDelete: Env = {}
      selectedRows.value.forEach((item: Env) => {
        toDelete[item.name] = ''
      })
      sdk
        .deleteEnv(toDelete)
        .then(async () => {
          await getEnv()
          selectedRows.value = []
        })
        .catch((error: Error | AxiosError) => {
          console.error('deleteEnv', error)
          selectedRows.value = []
        })
      // Delay to allow the container to restart and avoid navigation away too early
      setTimeout(() => {
        isLoading.value = false
      }, 4000)
    }

    function editVar(row: Rows) {
      newVarKey.value = row.name
      newVarValue.value = row.value
      isNewVarDialogOpen.value = true
    }

    async function getEnv() {
      getEnvResponse.value = await sdk.getEnv()
    }

    function setEnv() {
      isNewVarDialogOpen.value = false
      isLoading.value = true

      sdk
        .setEnv(newVarKey.value, newVarValue.value)
        .then(async () => {
          await getEnv()
        })
        .catch((error: Error | AxiosError) => {
          console.error('setEnv', error)
        })

      // Delay to allow the container to restart and avoid navigation away too early
      setTimeout(() => {
        isLoading.value = false
        newVarKey.value = ''
        newVarValue.value = ''
        $q.notify({
          type: 'warning',
          message: t('components.system.env_config.restarting_containers'),
          timeout: 0,
          actions: [
            {
              label: t('general.close'),
              handler: () => {
                /* ... */
              }
            }
          ]
        })
      }, 4000)
    }

    return {
      columns,
      deleteEnv,
      editVar,
      getEnvResponse,
      isLoading,
      isNewVarDialogOpen,
      newVarKey,
      newVarValue,
      qBtnStyle,
      qSpinnerStyle,
      regexpAlphaNum,
      refNewVarKey: ref(),
      selectedRows,
      setEnv
    }
  }
})
</script>
