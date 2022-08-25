<template>
  <q-tabs
    v-model="currentTab"
    no-caps
    outside-arrows
    mobile-arrows
    class="bg-accent shadow-2"
  >
    <q-tab
      name="welcome"
      :label="$t('components.layouts.captive_portal.welcome')"
    />
    <q-tab
      v-for="(tab, index) in tabs"
      :key="tab"
      :name="tab.title"
      @click="setAxios(tab.title)"
    >
      <div>
        <span class="q-mr-sm">{{ tab.title }}</span>
        <q-btn
          color="blue-grey-6"
          icon="cancel"
          size="xs"
          dense
          flat
          @click.stop="closeTab(index)"
        />
      </div>
    </q-tab>
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="currentTab" animated swipeable>
    <q-tab-panel class="q-pa-lg text-center" name="welcome">
      <!-- Logo -->
      <div class="q-mb-md">
        <img :src="qHeaderStyle.logo_coloured" style="max-width: 175px" />
      </div>
      <!-- Title -->
      <div class="text-h4 q-mb-md">
        {{ $t('title') }}
      </div>
      <q-input
        v-model="reqHostname"
        clearable
        placeholder="balena.local"
        class="q-mt-md"
        filled
        hide-bottom-space
        :label="$t('general.hostname')"
        @keydown.enter.prevent="setHostname(reqHostname)"
      >
        <template #after>
          <q-btn
            flat
            icon="send"
            :disable="!reqHostname"
            @click="setHostname(reqHostname)"
          /> </template
      ></q-input>
    </q-tab-panel>

    <q-tab-panel v-for="tab in tabs" :key="tab.title" :name="tab.title">
      <div class="q-pa-lg">
        <device-info />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script lang="ts">
import DeviceInfo from 'components/SystemDeviceInfo.vue'
import { qHeaderStyle } from 'src/config/qStyles'
import { axiosUrl } from 'stores/system'
import { defineComponent, ref } from 'vue'

interface tabIndex {
  title: string
}

export default defineComponent({
  name: 'LayoutsCaptivePortal',
  components: {
    DeviceInfo
  },
  setup() {
    const axiosBaseUrl = axiosUrl()
    const currentTab = ref('welcome')
    const reqHostname = ref('')
    const tabs = ref<tabIndex[]>([])

    function closeTab(index: number) {
      currentTab.value = 'welcome'
      tabs.value.splice(index, 1)
    }

    function setAxios(currentTabSetting: string) {
      axiosBaseUrl.setUrl(`http://${currentTabSetting}`)
    }

    function setHostname(reqHost: string) {
      tabs.value?.push({
        title: reqHost
      })
      setAxios(reqHost)
      currentTab.value = reqHost
      reqHostname.value = ''
    }

    return {
      closeTab,
      currentTab,
      qHeaderStyle,
      reqHostname,
      setAxios,
      setHostname,
      tabs
    }
  }
})
</script>
