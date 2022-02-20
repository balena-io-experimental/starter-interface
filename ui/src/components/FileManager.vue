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
      :no-data-label="$t('fileManager.empty_folder')"
      :no-results-label="$t('fileManager.no_results_found')"
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
                v-for="path in objPath"
                :key="path"
                v-ripple
                class="cursor-pointer"
                clickable
                :label="path"
                @click="
                  ;(objPath.length = objPath.indexOf(path) + 1), updateRows()
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
                  {{ $t('fileManager.new_folder') }}
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
                  {{ $t('fileManager.upload') }}
                </q-tooltip>
              </q-btn>
              <q-dialog v-model="uploaderDialog">
                <q-uploader
                  style="max-width: 300px"
                  :label="$t('fileManager.upload')"
                  color="white"
                  text-color="black"
                  multiple
                  flat
                  no-thumbnails
                  :readonly="delayUpload"
                  :filter="checkCharacters"
                  :url="'/filemanager/upload'"
                  :headers="[{ name: 'currentpath', value: objPath.join('/') }]"
                  @uploaded="updateRows()"
                  @failed="
                    $q.notify({
                      type: 'negative',
                      message: $t('general.Error')
                    })
                  "
                  @rejected="
                    $q.notify({
                      type: 'negative',
                      message: $t('fileManager.invalid_upload_string')
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
                  {{ $t('fileManager.delete') }}
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
                  {{ $t('fileManager.filter') }}
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
                  {{ $t('fileManager.full_screen') }}
                </q-tooltip>
              </q-btn>
              <q-input
                v-if="searchTable"
                v-model="filter"
                class="q-ml-md"
                dense
                debounce="300"
                hide-bottom-space
                :placeholder="$t('fileManager.filter')"
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
                  {{ $t('fileManager.size_colon')
                  }}{{ $t('fileManager.001_Mb') }}
                </div>
                <div v-else>
                  {{ $t('fileManager.size_colon') }}
                  {{ (props.row.stats.size / 1000000).toFixed(2) }}
                  {{ $t('fileManager.Mb') }}
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
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import expressApi from 'axios'
import FileDownload from 'js-file-download'
import { QTableProps, QUploaderProps, useQuasar } from 'quasar'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Rows extends QTableProps {
  name: any
  type: string
  path: string
}

export default defineComponent({
  name: 'IntFilemanager',
  setup() {
    // Import required features
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const delayUpload = ref<boolean>(false)
    const invalidCharacters = ref<Array<string>>(['/', '\\0'])
    const loading = ref<boolean>(true)
    const rows = ref<any>()
    const objPath = ref<any>([])
    const selected = ref<Array<{ path: string }>>([])

    const checkRowExistence = (nameParam: string) =>
      rows.value?.some(({ path }: any) => path.split('/').pop() === nameParam)

    const columns = computed(() => [
      {
        name: 'path',
        required: true,
        label: t('fileManager.Name'),
        align: 'left',
        field: (row: Rows) => row.path.split('/').pop(),
        format: (val: string) => `${val}`
      },
      { name: 'delete', field: 'delete' },
      { name: 'info', field: 'info' }
    ]) as any

    onMounted(async () => {
      $q.loading.show()

      await updateRows()

      $q.loading.hide()
    })

    function checkCharacters(files: any) {
      return files?.filter(
        (file: Rows) =>
          !invalidCharacters.value.some((el) => file.name.includes(el))
      )
    }
    function checkUploadOverwrite(files: Array<QUploaderProps>) {
      const itemCheck = files.filter((obj: any) => {
        return rows.value.some(
          ({ path }: any) => path.split('/').pop() === obj.name
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
          message: t('fileManager.upload_files_exist')
        })
      }
    }

    async function deleteCall(path: string) {
      await expressApi
        .post('/filemanager/delete', {
          currentPath: path
        })
        .catch(function (error) {
          console.log(error)
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
        .get<Rows>('/filemanager/download', {
          responseType: 'blob',
          params: {
            currentPath: row.path
          }
        })
        .then((response) =>
          FileDownload(
            response.data as never,
            row.path.split('/').pop() as never
          )
        )
        .catch(function (error) {
          console.log(error)
          $q.notify({ type: 'negative', message: t('general.Error') })
        })
      loading.value = false
    }

    function newFolder() {
      $q.dialog({
        title: t('fileManager.new_folder'),
        message: t('fileManager.enter_name'),
        prompt: {
          model: '',
          isValid: (val) => val !== ''
        },
        cancel: true
      }).onOk((newName: string) => {
        if (invalidCharacters.value.some((el) => newName.includes(el))) {
          $q.notify({
            type: 'negative',
            message: t('fileManager.invalid_filemanager_string')
          })
        } else {
          if (checkRowExistence(newName)) {
            $q.notify({
              type: 'negative',
              message: t('fileManager.item_already_exists')
            })
          } else {
            expressApi
              .post('/filemanager/newfolder', {
                currentPath: objPath.value,
                newFolderName: newName
              })
              .then(async () => {
                await updateRows()
                notifyComplete()
              })
              .catch(function (error) {
                console.log(error)
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

    async function onRowClick(_evt: unknown, row: Rows) {
      if (row.type === 'folder') {
        objPath.value.push(row.path.split('/').pop() as any)
        await updateRows()
      } else {
        await download(row)
      }
    }

    async function updateRows() {
      loading.value = true
      await expressApi
        .post<Rows>('/filemanager/list', {
          currentPath: objPath.value
        })
        .then((response) => {
          rows.value = response.data
        })
        .catch(function (error) {
          console.log(error)
          $q.notify({ type: 'negative', message: t('general.Error') })
        })
      loading.value = false
    }

    return {
      checkCharacters,
      checkUploadOverwrite,
      columns,
      delayUpload,
      deleteItem,
      deleteSelectedItems,
      filter: ref<string>(),
      loading,
      newFolder,
      objPath,
      onRowClick,
      rows,
      selected,
      searchTable: ref<boolean>(false),
      updateRows,
      uploaderDialog: ref<boolean>(false)
    }
  }
})
</script>

<style scoped></style>
