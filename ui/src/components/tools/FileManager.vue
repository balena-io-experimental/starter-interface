<template>
  <q-page class="items-center p-3">
    <q-table
      v-model:selected="selected"
      table-style="width: 90vw;"
      flat
      :dense="$q.screen.gt.sm"
      wrap-cells
      :filter="filter"
      :loading="loading"
      :rows="rows"
      :rows-per-page-options="[50, 75, 100, 0]"
      :columns="columns"
      :no-data-label="$t('file_manager.empty_folder')"
      :no-results-label="$t('file_manager.no_results_found')"
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
                class="cursor-pointer q-mb-xs"
                icon="home"
                clickable
              />
            </q-breadcrumbs>
            <q-breadcrumbs v-else>
              <q-breadcrumbs-el
                v-ripple
                class="cursor-pointer q-mb-xs"
                icon="home"
                clickable
                color="gray-800"
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
                class="q-mr-sm"
                icon="create_new_folder"
                color="gray-800"
                outline
                rounded
                size="sm"
                @click="newFolder()"
              >
                <q-tooltip
                  class="text-caption text-center"
                  anchor="top middle"
                  self="center middle"
                  :offset="[20, 20]"
                >
                  {{ $t('file_manager.new_folder') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                class="q-mr-sm"
                icon="upload"
                color="gray-800"
                outline
                rounded
                size="sm"
                @click="uploaderDialog = true"
              >
                <q-tooltip
                  class="text-caption text-center"
                  anchor="top middle"
                  self="center middle"
                  :offset="[20, 20]"
                >
                  {{ $t('file_manager.upload') }}
                </q-tooltip>
              </q-btn>
              <q-dialog v-model="uploaderDialog">
                <q-uploader
                  style="max-width: 300px"
                  :label="$t('file_manager.upload')"
                  color="white"
                  text-color="black"
                  multiple
                  flat
                  no-thumbnails
                  :readonly="delayUpload"
                  :url="uploaderAPIRoute"
                  :headers="[{ name: 'currentpath', value: objPath.join('/') }]"
                  @uploaded="updateRows()"
                  @failed="onUploaderFailed"
                  @rejected="
                    $q.notify({
                      type: 'negative',
                      message: $t('file_manager.invalid_upload_string')
                    })
                  "
                  @added="checkUploadOverwrite"
                />
              </q-dialog>
              <q-btn
                class="q-mr-sm"
                size="sm"
                color="gray-800"
                rounded
                outline
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
                  {{ $t('file_manager.delete') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                icon="search"
                color="gray-800 q-mr-xs"
                outline
                rounded
                size="sm"
                @click="searchTable = true"
              >
                <q-tooltip
                  class="text-caption text-center"
                  anchor="top middle"
                  self="center middle"
                  :offset="[20, 20]"
                >
                  {{ $t('file_manager.filter') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="$q.screen.gt.sm"
                class="q-mr-xs"
                flat
                round
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
                  {{ $t('file_manager.full_screen') }}
                </q-tooltip>
              </q-btn>
              <q-input
                v-if="searchTable"
                v-model="filter"
                class="q-ml-md"
                dense
                debounce="300"
                hide-bottom-space
                :placeholder="$t('file_manager.filter')"
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
          <q-icon
            v-if="props.row.type === 'folder'"
            class="mb-1"
            color="gray-800"
            left
            name="folder"
          />
          <q-icon
            v-else
            class="mb-1"
            color="gray-800"
            left
            name="insert_drive_file"
          />
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
              <q-tooltip class="text-caption">
                <div v-if="props.row.stats.size < 10000">
                  {{ $t('file_manager.size_colon')
                  }}{{ $t('file_manager.001_Mb') }}
                </div>
                <div v-else>
                  {{ $t('file_manager.size_colon') }}
                  {{ (props.row.stats.size / 1000000).toFixed(2) }}
                  {{ $t('file_manager.Mb') }}
                </div>
              </q-tooltip>
            </q-icon>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import expressApi from 'axios'
import FileDownload from 'js-file-download'
import { QTableProps, QUploaderProps, useQuasar } from 'quasar'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Rows extends QTableProps {
  name: string
  type: string
  path: string
}

export default defineComponent({
  name: 'IntFileManagerComponent',
  setup() {
    // Import required features
    const $q = useQuasar()
    const { t } = useI18n()

    const delayUpload = ref<boolean>(false)
    const invalidCharacters = ref<Array<string>>(['/', '\\0'])
    const loading = ref<boolean>(true)
    const objPath = ref<Array<string>>([])
    const rows = ref<Rows[]>()
    const selected = ref<Array<{ path: string }>>([])
    const uploaderAPIRoute = ref<string>('v1/filemanager/upload')

    // Change uploader path based on environment
    if (process.env.BACKEND_PORT) {
      uploaderAPIRoute.value = `${window.location.protocol}//${window.location.hostname}:${process.env.BACKEND_PORT}/v1/filemanager/upload`
    } else if (!process.env.ON_DEVICE) {
      // ExpressJS listens to port 80 by default. This allows it to be accesible when in a dev env.
      uploaderAPIRoute.value = `${window.location.protocol}//${window.location.hostname}/v1/filemanager/upload`
    }

    const checkRowExistence = (nameParam: string) =>
      rows.value?.some(({ path }) => path.split('/').pop() === nameParam)

    const columns = computed<QTableProps['columns']>(() => [
      {
        name: 'path',
        required: true,
        label: t('file_manager.Name'),
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

    function checkUploadOverwrite(files: Array<QUploaderProps['onAdded']>) {
      const itemCheck = files.filter((obj) => {
        return rows.value?.some(
          ({ path }) => path.split('/').pop() === obj?.name
        )
      })

      if (itemCheck.length > 0) {
        delayUpload.value = true
        $q.notify({
          actions: [
            {
              label: t('general.close'),
              color: 'black',
              handler: () => {
                /* ... */
              }
            }
          ],
          onDismiss: () => {
            delayUpload.value = false
          },
          timeout: 0,
          type: 'warning',
          position: 'center',
          message: t('file_manager.upload_files_exist')
        })
      }
    }

    async function deleteCall(path: string) {
      await expressApi
        .post('/v1/filemanager/delete', {
          currentPath: path
        })
        .catch(function () {
          $q.notify({ type: 'negative', message: t('general.Error') })
        })
    }

    async function deleteItem(row: Rows) {
      loading.value = true
      await deleteCall(row.path)
      await updateRows()
      loading.value = false
    }

    async function deleteSelectedItems() {
      loading.value = true

      for (const item of selected.value) {
        await deleteCall(item.path)
      }

      await updateRows()
      loading.value = false
    }

    async function download(row: Rows) {
      loading.value = true
      await expressApi
        .get('/v1/filemanager/download', {
          responseType: 'blob',
          params: {
            currentPath: row.path
          }
        })
        .then((response) =>
          FileDownload(
            response.data as string,
            row.path.split('/').pop() as string
          )
        )
        .catch(function () {
          $q.notify({ type: 'negative', message: t('general.Error') })
        })
      loading.value = false
    }

    function newFolder() {
      $q.dialog({
        title: t('file_manager.new_folder'),
        message: t('file_manager.enter_name'),
        prompt: {
          model: '',
          isValid: (val) => val !== ''
        },
        cancel: true
      }).onOk((newName: string) => {
        if (invalidCharacters.value.some((el) => newName.includes(el))) {
          $q.notify({
            type: 'negative',
            message: t('file_manager.invalid_filemanager_string')
          })
        } else {
          if (checkRowExistence(newName)) {
            $q.notify({
              type: 'negative',
              message: t('file_manager.item_already_exists')
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
              .catch(function () {
                $q.notify({ type: 'negative', message: t('general.Error') })
              })
          }
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
      if (loading.value) {
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
      console.log(info)
      $q.notify({
        type: 'negative',
        message: t('general.Error')
      })
    }

    async function updateRows() {
      loading.value = true
      await expressApi
        .post<Rows[]>('/v1/filemanager/list', {
          currentPathArray: objPath.value
        })
        .then((response) => {
          rows.value = response.data
        })
        .catch(function () {
          $q.notify({ type: 'negative', message: t('general.Error') })
        })
      loading.value = false
    }

    return {
      checkUploadOverwrite,
      columns,
      delayUpload,
      deleteItem,
      deleteSelectedItems,
      filter: ref(),
      loading,
      newFolder,
      objPath,
      onRowClick,
      onUploaderFailed,
      rows,
      selected,
      searchTable: ref<boolean>(false),
      updateRows,
      uploaderAPIRoute,
      uploaderDialog: ref<boolean>(false)
    }
  }
})
</script>

<style scoped></style>
