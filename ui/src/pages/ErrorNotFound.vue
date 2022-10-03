<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <div>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        {{ $t('system.errors.wrong_way') }}
      </div>

      <q-btn
        v-bind="qBtnStyle"
        class="q-mt-xl"
        unelevated
        to="/"
        :label="$t('general.go_home')"
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { qBtnStyle } from 'src/config/qStyles'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound',
  setup() {
    return { qBtnStyle }
  }
})
</script>
