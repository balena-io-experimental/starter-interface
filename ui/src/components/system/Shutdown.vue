<template>
  <q-btn
    flat
    dense
    round
    icon="power_settings_new"
    color="secondary"
    @click="confirm = true"
  />
  <q-dialog v-model="confirm">
    <q-card>
      <q-card-section
        class="row items-center"
        style="width: 300px; max-width: 80vw"
      >
        <q-avatar
          icon="power_settings_new"
          color="primary"
          text-color="accent"
        />
        <div class="col">
          <div class="row q-ml-sm q-mt-sm">
            {{ $t('general.are_you_sure') }}
          </div>
          <div class="items-right align-right text-right justify-right">
            <q-checkbox
              v-model="checkBox"
              class="q-ml-md text-caption"
              size="xs"
              :label="$t('components.system.shutdown.force_shutdown')"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          flat
          :label="$t('general.cancel')"
          color="primary"
        />
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          flat
          :label="$t('general.ok')"
          color="primary"
          @click="shutdown()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { supervisorRequests } from 'src/api/supervisorRequests'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IntShutdownComponent',
  setup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()
    const $q = useQuasar()

    const checkBox = ref<boolean>(false)

    function shutdown() {
      // This does not wait for return of promise as connection is lost too quickly
      void supervisorRequests.shutdown(checkBox.value)

      setTimeout(() => {
        $q.notify({
          type: 'positive',
          timeout: 0,
          message: t('components.system.shutdown.shutting_down')
        })
      }, 1500)
    }
    return {
      checkBox,
      confirm: ref(false),
      qBtnStyle,
      shutdown
    }
  }
})
</script>
