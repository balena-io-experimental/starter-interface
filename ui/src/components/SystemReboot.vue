<template>
  <q-btn
    size="12px"
    flat
    dense
    round
    icon="restart_alt"
    @click="confirm = true"
  />
  <q-dialog v-model="confirm">
    <q-card>
      <q-card-section
        class="row items-center"
        style="width: 300px; max-width: 80vw"
      >
        <q-avatar v-bind="qAvatarStyle" icon="restart_alt" />
        <div class="row q-ml-md">
          {{ $t('general.are_you_sure') }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <div class="q-mr-md">
          <q-checkbox
            v-model="checkBox"
            class="q-ml-md text-caption"
            size="xs"
            :label="$t('components.system.reboot.force_restart')"
          />
        </div>
        <q-btn v-close-popup v-bind="qBtnStyle" :label="$t('general.cancel')" />
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          :label="$t('general.ok')"
          @click="reboot()"
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
  name: 'SystemReboot',
  setup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()
    const $q = useQuasar()

    const checkBox = ref<boolean>(false)

    function reboot() {
      // This does not wait for return of promise as connection is lost too quickly
      void supervisor.v1.reboot(checkBox.value)

      setTimeout(() => {
        $q.notify({
          type: 'positive',
          timeout: 0,
          message: t('components.system.reboot.restarting')
        })
      }, 1500)
    }
    return {
      qAvatarStyle,
      checkBox,
      confirm: ref(false),
      qBtnStyle,
      reboot
    }
  }
})
</script>
