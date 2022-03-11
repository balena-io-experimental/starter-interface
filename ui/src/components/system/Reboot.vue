<template>
  <q-btn
    flat
    dense
    round
    icon="restart_alt"
    color="secondary"
    @click="confirm = true"
  />
  <q-dialog v-model="confirm">
    <q-card>
      <q-card-section
        class="row items-center"
        style="width: 300px; max-width: 80vw"
      >
        <q-avatar icon="restart_alt" color="primary" text-color="accent" />
        <div class="col">
          <div class="row q-ml-sm q-mt-sm">
            {{ $t('general.are_you_sure') }}
          </div>
          <div class="items-right align-right text-right justify-right">
            <q-checkbox
              v-model="checkBox"
              class="q-ml-md text-caption"
              size="xs"
              :label="$t('system.force_restart')"
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
          @click="reboot()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { supervisorRequests } from 'src/api/SupervisorRequests'
import { useQuasar } from 'quasar'
import { qBtnStyle } from 'components/styles/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IntRebootComponent',
  setup() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()
    const $q = useQuasar()

    const checkBox = ref<boolean>(false)

    function reboot() {
      void supervisorRequests.reboot(checkBox.value)

      // This does not wait for return of promise as connection is lost too quickly
      setTimeout(() => {
        $q.notify({
          type: 'positive',
          timeout: 0,
          message: t('system.restarting')
        })
      }, 1500)
    }
    return {
      checkBox,
      confirm: ref(false),
      qBtnStyle,
      reboot
    }
  }
})
</script>
