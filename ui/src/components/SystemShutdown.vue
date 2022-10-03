<template>
  <q-btn
    size="12px"
    flat
    dense
    round
    icon="power_settings_new"
    @click="confirm = true"
  />
  <q-dialog v-model="confirm">
    <q-card>
      <q-card-section
        class="row items-center"
        style="width: 300px; max-width: 80vw"
      >
        <q-avatar v-bind="qAvatarStyle" icon="power_settings_new" />
        <div class="row q-ml-sm">
          {{ $t('general.are_you_sure') }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <div class="q-mr-md">
          <q-checkbox
            v-model="isCheckBox"
            class="q-ml-md text-caption"
            size="xs"
            :label="$t('components.system.shutdown.force_shutdown')"
          />
        </div>
        <q-btn v-close-popup v-bind="qBtnStyle" :label="$t('general.cancel')" />
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          :label="$t('general.ok')"
          @click="shutdown()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { supervisor } from 'src/api/supervisor'
import { qAvatarStyle, qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'SystemShutdown',
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const isCheckBox = ref<boolean>(false)

    function shutdown() {
      // This does not wait for return of promise as connection is lost too quickly
      void supervisor.v1.shutdown(isCheckBox.value)

      setTimeout(() => {
        $q.notify({
          type: 'positive',
          timeout: 0,
          message: t('components.system.shutdown.shutting_down')
        })
      }, 1500)
    }
    return {
      confirm: ref(false),
      isCheckBox,
      qAvatarStyle,
      qBtnStyle,
      shutdown
    }
  }
})
</script>
