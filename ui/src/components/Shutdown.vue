<template>
  <q-btn
    flat
    dense
    round
    icon="power_settings_new"
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
        <span class="q-ml-md">{{ $t('are_you_sure') }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          flat
          :label="$t('cancel')"
          color="primary"
        />
        <q-btn
          v-close-popup
          v-bind="qBtnStyle"
          flat
          :label="$t('ok')"
          color="primary"
          @click="shutdown()"
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
  name: 'IntShutdownComponent',
  setup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()
    const $q = useQuasar()
    const checkBox = ref<boolean>(false)

    async function shutdown() {
      await supervisorRequests.shutdown(checkBox.value).then(() => {
        $q.notify({ type: 'positive', message: t('shutting_down') })
      })
    }
    return {
      confirm: ref(false),
      qBtnStyle,
      shutdown
    }
  }
})
</script>
