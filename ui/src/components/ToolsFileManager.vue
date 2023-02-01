<template>
  <q-table
    v-model:selected="selected"
    table-style="width: 90vw;"
    flat
    :dense="$q.screen.gt.sm"
    wrap-cells
    :filter="filter"
    :loading="isLoading"
    :rows="rows"
    :rows-per-page-options="[50, 75, 100, 0]"
    :columns="columns"
    :no-data-label="$t('components.tools.file_manager.empty_folder')"
    :no-results-label="$t('components.tools.file_manager.no_results_found')"
    :selection="'multiple'"
    row-key="path"
    @row-click="onRowClick"
  >
    <!-- Toolbar -->
    <template #top="props">
      <div
        class="flex row full-width row reverse-wrap justify-between items-center"
      >
        <div class="col-auto q-m-xs q-mt-xs">
          <q-breadcrumbs v-if="!objPath[0]">
            <q-breadcrumbs-el
              v-ripple
              :label="rootDir"
              class="cursor-pointer"
              icon="home"
              clickable
            />
          </q-breadcrumbs>
          <q-breadcrumbs v-else>
            <q-breadcrumbs-el
              v-ripple
              :label="rootDir"
              class="cursor-pointer"
              icon="home"
              clickable
              @click="objPath.splice(0, objPath.length), updateRows()"
            />
            <q-breadcrumbs-el
              v-for="item in objPath"
              :key="item"
              v-ripple
              class="cursor-pointer"
              clickable
              :label="item"
              @click="
                ;(objPath.length = objPath.indexOf(item) + 1), updateRows()
              "
            />
          </q-breadcrumbs>
        </div>
        <div class="col-auto q-ml-sm q-mb-sm">
          <div>
            <q-btn
              v-bind="qBtnStyle"
              class="q-mr-sm"
              icon="create_new_folder"
              size="sm"
              @click="newFolder()"
            >
              <q-tooltip
                class="text-caption text-center"
                anchor="top middle"
                self="center middle"
                :offset="[20, 20]"
              >
                {{ $t('components.tools.file_manager.new_folder') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-bind="qBtnStyle"
              class="q-mr-sm"
              icon="upload"
              size="sm"
              @click="isUploaderDialog = true"
            >
              <q-tooltip
                class="text-caption text-center"
                anchor="top middle"
                self="center middle"
                :offset="[20, 20]"
              >
                {{ $t('components.tools.file_manager.upload') }}
              </q-tooltip>
            </q-btn>
            <q-dialog v-model="isUploaderDialog">
              <!-- Uploader headers must be lowercase, not CamelCase -->
              <q-uploader
                style="max-width: 300px"
                :label="$t('components.tools.file_manager.upload')"
                multiple
                flat
                no-thumbnails
                :readonly="isDelayUpload"
                :url="uploaderAPIRoute"
                :headers="[{ name: 'currentpath', value: objPath.join('/') }]"
                @uploaded="updateRows()"
                @failed="onUploaderFailed"
                @rejected="
                  $q.notify({
                    type: 'negative',
                    message: $t(
                      'components.tools.file_manager.invalid_upload_string'
                    )
                  })
                "
                @added="checkItemOverwrite"
              />
            </q-dialog>
            <q-btn
              v-bind="qBtnStyle"
              class="q-mr-sm"
              size="sm"
              :disabled="!selected[0]"
              icon="delete"
              @click="deleteSelectedItems()"
            >
              <q-tooltip
                class="text-caption text-center"
                anchor="top middle"
                self="center middle"
                :offset="[20, 20]"
              >
                {{ $t('components.tools.file_manager.delete') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-bind="qBtnStyle"
              class="q-mr-sm"
              icon="search"
              size="sm"
              @click="isSearchTable = true"
            >
              <q-tooltip
                class="text-caption text-center"
                anchor="top middle"
                self="center middle"
                :offset="[20, 20]"
              >
                {{ $t('components.tools.file_manager.filter') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="$q.screen.gt.sm"
              v-bind="qBtnStyle"
              class="q-mr-xs"
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen()"
            >
              <q-tooltip
                class="text-caption text-center"
                anchor="top middle"
                self="center middle"
                :offset="[20, 20]"
              >
                {{ $t('components.tools.file_manager.full_screen') }}
              </q-tooltip>
            </q-btn>
            <q-input
              v-if="isSearchTable"
              v-model="filter"
              class="q-ml-md"
              dense
              debounce="300"
              hide-bottom-space
              :placeholder="$t('components.tools.file_manager.filter')"
            >
              <template #append>
                <q-icon
                  name="close"
                  class="cursor-pointer"
                  @click="filter = ''"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </template>
    <!-- Row icons -->
    <template #body-cell-path="props">
      <q-td :props="props">
        <q-icon v-if="props.row.type === 'folder'" left name="folder" />
        <q-icon v-else left name="insert_drive_file" />
        {{ props.value }}
      </q-td>
    </template>

    <!-- Delete file -->
    <template #body-cell-delete="props">
      <q-td :props="props" auto-width>
        <q-icon size="xs" name="delete" @click.stop="deleteItem(props.row)" />
      </q-td>
    </template>

    <!-- File size -->
    <template #body-cell-info="props">
      <q-td :props="props" auto-width>
        <div v-if="props.row.type == 'file'">
          <q-icon size="xs" name="info">
            <q-tooltip
              class="text-caption text-center text-no-wrap"
              anchor="top middle"
              self="center middle"
              :offset="[20, 20]"
            >
              <div v-if="props.row.stats.size < 10000">
                {{ $t('components.tools.file_manager.size_colon')
                }}{{ $t('components.tools.file_manager.mb_001') }}
              </div>
              <div v-else>
                {{ $t('components.tools.file_manager.size_colon') }}
                {{ (props.row.stats.size / 1000000).toFixed(2) }}
                {{ $t('components.tools.file_manager.mb') }}
              </div>
            </q-tooltip>
          </q-icon>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { expressApi } from 'boot/axios'
import FileDownload from 'js-file-download'
import { QTableProps, QUploaderProps, useQuasar } from 'quasar'
import { qBtnStyle } from 'src/config/qStyles'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface List {
  list: Rows[]
  rootDir: string
}

interface Rows extends QTableProps {
  name: string
  type: string
  path: string
}

export default defineComponent({
  name: 'ToolsFileManager',
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const isDelayUpload = ref<boolean>(false)
    const invalidCharacters = ref<Array<string>>(['/', '\\0'])
    const isLoading = ref<boolean>(true)
    const objPath = ref<Array<string>>([])
    const rootDir = ref<string>('')
    const rows = ref<Rows[]>()
    const selected = ref<Array<{ path: string }>>([])
    const uploaderAPIRoute = ref<string>(
      `${expressApi.defaults.baseURL as string}/v1/filemanager/upload`
    )

    const checkRowExistence = (nameParam: string) =>
      rows.value?.some(({ path }) => path.split('/').pop() === nameParam)

    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'path',
        required: true,
        label: t('components.tools.file_manager.name'),
        align: 'left',
        field: (row: Rows) => row.path.split('/').pop(),
        format: (val: string) => `${val}`
      },
      { name: 'delete', label: '', field: 'delete' },
      { name: 'info', label: '', field: 'info' }
    ])

    onMounted(async () => {
      await updateRows()
    })

    const checkItemOverwrite: QUploaderProps['onAdded'] = (files) => {
      const itemCheck = files.filter((obj: QUploaderProps['onAdded']) =>
        rows.value?.some(({ path }) => path.split('/').pop() === obj?.name)
      )

      if (itemCheck.length > 0) {
        isDelayUpload.value = true
        $q.notify({
          actions: [
            {
              label: t('general.close'),
              handler: () => {
                /* ... */
              }
            }
          ],
          onDismiss: () => {
            isDelayUpload.value = false
          },
          timeout: 0,
          type: 'warning',
          position: 'center',
          message: t('components.tools.file_manager.upload_files_exist')
        })
      }
    }

    async function deleteItem(row: Rows) {
      isLoading.value = true

      try {
        await expressApi.post('/v1/filemanager/delete', {
          currentPath: row.path
        })
      } catch (error) {
        $q.notify({ type: 'negative', message: t('general.error') })
        isLoading.value = false
      }

      await updateRows()
      isLoading.value = false
    }

    async function deleteSelectedItems() {
      isLoading.value = true

      try {
        await expressApi.post('/v1/filemanager/delete', {
          selectedPaths: selected.value
        })
      } catch (error) {
        $q.notify({ type: 'negative', message: t('general.error') })
      }

      await updateRows()
      isLoading.value = false
    }

    async function download(row: Rows) {
      isLoading.value = true
      try {
        const response = await expressApi.get('/v1/filemanager/download', {
          responseType: 'blob',
          params: {
            currentPath: row.path
          }
        })

        FileDownload(
          response.data as string,
          row.path.split('/').pop() as string
        )
      } catch {
        $q.notify({ type: 'negative', message: t('general.error') })
      }
      isLoading.value = false
    }

    function newFolder() {
      $q.dialog({
        title: t('components.tools.file_manager.new_folder'),
        message: t('components.tools.file_manager.enter_name'),
        prompt: {
          model: '',
          isValid: (val) => val !== ''
        },
        cancel: true
      }).onOk((newName: string) => {
        if (invalidCharacters.value.some((el) => newName.includes(el))) {
          $q.notify({
            type: 'negative',
            message: t(
              'components.tools.file_manager.invalid_filemanager_string'
            )
          })
        } else if (checkRowExistence(newName)) {
          $q.notify({
            type: 'negative',
            message: t('components.tools.file_manager.item_already_exists')
          })
        } else {
          expressApi
            .post('/v1/filemanager/newfolder', {
              currentPathArray: objPath.value,
              newFolderName: newName
            })
            .then(async () => {
              await updateRows()
              notifyComplete()
            })
            .catch(() => {
              $q.notify({ type: 'negative', message: t('general.error') })
            })
        }
      })
    }

    function notifyComplete() {
      $q.notify({
        type: 'positive',
        icon: 'done',
        timeout: 100
      })
    }

    const onRowClick: QTableProps['onRowClick'] = (_evt, row: Rows) => {
      if (isLoading.value) {
        return
      }
      if (row.type === 'folder') {
        objPath.value.push(row.path.split('/').pop() as string)
        void updateRows()
      } else {
        void download(row)
      }
    }

    const onUploaderFailed: QUploaderProps['onFailed'] = (info) => {
      console.error(info)
      $q.notify({
        type: 'negative',
        message: t('general.error')
      })
    }

    async function updateRows() {
      isLoading.value = true
      try {
        const response = await expressApi.post<List>('/v1/filemanager/list', {
          currentPathArray: objPath.value
        })
        rows.value = response.data.list
        rootDir.value = response.data.rootDir
      } catch (error) {
        $q.notify({ type: 'negative' })
        console.error(error)
      }
      isLoading.value = false
    }

    return {
      checkItemOverwrite,
      columns,
      deleteItem,
      deleteSelectedItems,
      filter: ref(),
      isDelayUpload,
      isLoading,
      isSearchTable: ref<boolean>(false),
      isUploaderDialog: ref<boolean>(false),
      newFolder,
      objPath,
      onRowClick,
      onUploaderFailed,
      qBtnStyle,
      rootDir,
      rows,
      selected,
      updateRows,
      uploaderAPIRoute
    }
  }
})
</script>

<style scoped></style>
