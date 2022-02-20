<template>
  <q-btn
    flat
    dense
    round
    icon="restart_alt"
    color="secondary"
    @click="confirm = true"
  />
  <q-dialog v-model="confirm" persistent>
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
        <span class="q-ml-md">{{ $t('general.are_you_sure') }}</span>
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
          @click="reboot()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { supervisorRequests } from '../api/SupervisorRequests'
import { useQuasar } from 'quasar'
import { qBtnStyle } from './styles/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IntRebootComponent',
  setup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()
    const $q = useQuasar()

    const checkBox = ref<boolean>(false)

    async function reboot() {
      await supervisorRequests.reboot(checkBox.value).then(() => {
        $q.notify({ type: 'positive', message: t('system.restarting') })
      })
    }
    return {
      confirm: ref(false),
      qBtnStyle,
      reboot
    }
  }
})
</script>
