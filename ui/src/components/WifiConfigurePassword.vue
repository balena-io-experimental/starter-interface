<template>
  <div>
    <q-btn
      v-bind="qBtnStyle"
      icon="wifi_password"
      :loading="isSubmitting"
      :label="$t('components.wifi.configure_password.set_new_hotspot_password')"
      @click="passwordDialog = true"
    />

    <q-dialog v-model="passwordDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            v-bind="qAvatarStyle"
            class="q-mr-md"
            icon="wifi_password"
          />
          <q-input
            ref="passwordInput"
            v-model="passwordText"
            bottom-slots
            :rules="[
              (value) =>
                !value.includes(' ') ||
                $t('components.wifi.configure_password.invalid_name')
            ]"
            :type="isPwd ? 'password' : 'text'"
            :label="
              $t('components.wifi.configure_password.set_new_hotspot_password')
            "
          >
            <template #append>
              <q-icon
                size="xs"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
            <template #hint>
              {{
                $t('components.wifi.configure_password.invalid_password_length')
              }}
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            v-bind="qBtnStyle"
            flat
            :label="$t('general.cancel')"
          />
          <q-btn
            v-close-popup
            v-bind="qBtnStyle"
            flat
            :disable="passwordText.length < 8"
            :label="$t('general.ok')"
            @click="setHotspotPassword()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { expressApi } from 'boot/axios'
import { QForm, useQuasar } from 'quasar'
import { qAvatarStyle, qBtnStyle } from 'src/config/qStyles'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'WifiConfigurePassword',
  setup() {
    const $q = useQuasar()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const isSubmitting = ref<boolean>(false)
    const passwordInput = ref<QForm>()
    const passwordText = ref<string>('')

    function notify(type: string, message: string) {
      $q.notify({
        type,
        multiLine: true,
        timeout: 0,
        actions: [
          {
            label: t('general.close'),
            handler: () => {
              /* ... */
            }
          }
        ],
        message
      })
    }

    async function setHotspotPassword() {
      if (!passwordInput.value?.validate()) {
        return
      }
      isSubmitting.value = true
      try {
        await expressApi.post('/v1/wifi', {
          type: 'POST',
          path: 'v1/set_hotspot_password',
          params: { password: passwordText.value }
        })

        notify('positive', t('components.wifi.configure_password.password_set'))
        isSubmitting.value = false
      } catch {
        notify('negative', t('system.network.no_wifi_api'))
      }

      passwordText.value = ''
      isSubmitting.value = false
    }

    return {
      isPwd: ref(true),
      isSubmitting,
      passwordDialog: ref(false),
      passwordInput,
      passwordText,
      qAvatarStyle,
      qBtnStyle,
      setHotspotPassword
    }
  }
})
</script>

<style scoped></style>
