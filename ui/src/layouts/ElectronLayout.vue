<template>
  <q-bar class="bg-accent q-electron-drag" dense>
    <div class="row justify-between content-center full-width no-wrap">
      <div class="col-4 no-wrap">
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="red"
          @click="electronCloseApp"
        />
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="yellow"
          @click="electronMinimize"
        />
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="green"
          @click="electronToggleMaximize"
        />
      </div>
      <div class="no-wrap">
        <q-avatar square size="xs" class="q-mr-sm">
          <img :src="qHeaderStyle.logo_coloured" /> </q-avatar
        >{{ $t('title') }}
      </div>
      <div class="col-4"></div>
    </div>
  </q-bar>
  <device-selector-hostname />
</template>

<script lang="ts">
import DeviceSelectorHostname from 'components/DeviceSelectorHostname.vue'
import { defineComponent } from 'vue'
import { qHeaderStyle } from 'src/config/qStyles'

declare const window: Window &
  typeof globalThis & {
    myWindowAPI: {
      close: () => void
      minimize: () => void
      toggleMaximize: () => void
    }
  }

export default defineComponent({
  name: 'LayoutsElectronLayout',
  components: {
    DeviceSelectorHostname
  },
  setup() {
    function electronCloseApp() {
      window.myWindowAPI.close()
    }

    function electronMinimize() {
      window.myWindowAPI.minimize()
    }

    function electronToggleMaximize() {
      window.myWindowAPI.toggleMaximize()
    }

    return {
      electronCloseApp,
      electronMinimize,
      electronToggleMaximize,
      qHeaderStyle
    }
  }
})
</script>
