<template>
  <div class="q-pa-lg">
    <div class="text-center q-mb-md">
      <q-img :src="qHeaderStyle.logo" style="max-width: 175px" />
    </div>
    <div class="text-h4 text-gray-600 text-center mt-2">
      {{ $t('titles.title') }}
    </div>
  </div>
</template>

<script lang="ts">
import { qHeaderStyle } from 'components/styles/qStyles'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntCaptivePortal',
  setup() {
    return {
      qHeaderStyle
    }
  }
})
</script>
