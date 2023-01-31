<template>
  <div v-if="networkStore.isCloudlink">
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
                @click="editEnv(props.row)"
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
          @click="isNewEnvDialog = true"
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
          v-model="isNewEnvDialog"
          persistent
          @hide=";(newEnvKey = ''), (newEnvValue = '')"
        >
          <q-card style="min-width: 250px">
            <q-card-section>
              <div class="text-h6">
                {{ $t('components.system.env_config.add_env_var') }}
              </div>
              <div class="text-caption text-grey">
                <q-icon
                  class="q-mr-sm q-mb-xs"
                  name="warning"
                  color="warning"
                />
                {{ $t('components.system.env_config.env_var_warning_message') }}
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input
                ref="refNewEnvKey"
                v-model="newEnvKey"
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
                v-model="newEnvValue"
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
                :disable="!newEnvValue || !newEnvKey || refNewEnvKey?.hasError"
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
  </div>
  <div v-else>
    {{ $t('components.system.device_info.sdk_unavailable') }}
    {{ $t('components.system.device_info.are_you_connected_fleet') }}
  </div>
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios'
import { QTableProps, useQuasar } from 'quasar'
import { sdk } from 'src/api/sdk'
import { qBtnStyle, qSpinnerStyle } from 'src/config/qStyles'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { networkSettings } from 'stores/system'

interface EnvVar {
  [key: string]: string
}

interface Rows extends QTableProps {
  name: string
  value: string
}

export default defineComponent({
  name: 'SystemEnvConfig',

  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()
    const networkStore = networkSettings()

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
    const isNewEnvDialog = ref<boolean>(false)
    const isLoading = ref<boolean>(true)
    const newEnvKey = ref<string>('')
    const newEnvValue = ref<string>('')
    const regexpAlphaNum = ref(/^[A-Za-z][A-Za-z0-9_]*$/)
    const selectedRows = ref([])

    onMounted(async () => {
      if (!networkStore.isCloudlink) {
        isLoading.value = false
        return
      }
      // Fetch current environment variables
      await getEnv().catch((error: Error | AxiosError) => {
        console.error('getEnv', error)
      })
      isLoading.value = false
    })

    async function deleteEnv() {
      isLoading.value = true
      const toDelete: EnvVar = {}
      selectedRows.value.forEach((item: EnvVar) => {
        toDelete[item.name] = ''
      })
      try {
        await sdk.deleteEnv(toDelete)
        await getEnv()
        selectedRows.value = []
      } catch (error) {
        console.error(error)
        selectedRows.value = []
      }

      // Delay to allow the container to restart and avoid navigation away too early
      setTimeout(() => {
        isLoading.value = false
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

    function editEnv(row: Rows) {
      newEnvKey.value = row.name
      newEnvValue.value = row.value
      isNewEnvDialog.value = true
    }

    async function getEnv() {
      getEnvResponse.value = await sdk.getEnv()
    }

    async function setEnv() {
      isNewEnvDialog.value = false
      isLoading.value = true

      try {
        await sdk.setEnv(newEnvKey.value, newEnvValue.value)
        await getEnv()
      } catch (error) {
        console.error('setEnv', error)
      }

      // Delay to allow the container to restart and avoid navigation away too early
      setTimeout(() => {
        isLoading.value = false
        newEnvKey.value = ''
        newEnvValue.value = ''
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
      editEnv,
      getEnvResponse,
      isLoading,
      isNewEnvDialog,
      networkStore,
      newEnvKey,
      newEnvValue,
      qBtnStyle,
      qSpinnerStyle,
      regexpAlphaNum,
      refNewEnvKey: ref(),
      selectedRows,
      setEnv
    }
  }
})
</script>
