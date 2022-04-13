<template>
  <q-layout view="hHh Lpr lFf">
    <q-header v-bind="qHeaderStyle.header">
      <q-toolbar>
        <q-btn
          class="q-mr-sm"
          color="secondary"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <router-link v-if="qHeaderStyle.logo" to="/">
          <q-avatar>
            <img :src="qHeaderStyle.logo" />
          </q-avatar>
        </router-link>

        <q-toolbar-title v-bind="qHeaderStyle.title">
          <div v-if="$q.screen.gt.xs">
            {{ $t('title') }}
          </div>
          <q-slide-transition v-else :duration="1000">
            <div v-if="deviceName" class="text-secondary text-subtitle1">
              {{ deviceName }}
            </div>
          </q-slide-transition>
        </q-toolbar-title>

        <q-slide-transition :duration="1000">
          <div
            v-if="deviceName && $q.screen.gt.xs"
            class="text-secondary text-subtitle1 q-mr-md"
          >
            {{ deviceName }}
          </div>
        </q-slide-transition>

        <q-btn
          :loading="changingLang"
          icon="translate"
          color="secondary"
          round
          flat
          dense
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                v-for="language in localeOptions"
                :key="language.value"
                v-close-popup
                clickable
                @click="changeLang(language.value)"
              >
                <q-item-section>{{ language.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <div>
          <Reboot />
        </div>

        <div>
          <Shutdown />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="210" bordered>
      <MenuItems
        v-for="link in menuItems"
        :key="link.label"
        v-bind="link"
        :active="link.path === currentLink"
        @click="currentLink = link.path"
      />
    </q-drawer>

    <q-page-container>
      <div>
        <q-slide-transition>
          <q-banner
            v-if="networkDown"
            dense
            inline-actions
            class="text-white bg-negative"
          >
            {{ $t('system.network.network_connection_down') }}
            <template #action>
              <q-btn
                flat
                padding="0"
                color="white"
                :label="$t('general.close')"
                @click="networkDown = false"
              />
            </template>
          </q-banner>
        </q-slide-transition>
        <q-slide-transition>
          <q-banner
            v-if="networkUp"
            dense
            inline-actions
            class="text-white bg-positive"
          >
            {{ $t('system.network.network_connection_restored') }}
          </q-banner>
        </q-slide-transition>
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { loadLanguageAsync } from 'boot/i18n'
import localeOptions from 'src/config/localeOptions'
import MenuItems from 'layouts/MenuItems.vue'
import menuList from 'src/config/menuList'
import { qHeaderStyle } from 'src/config/qStyles'
import Reboot from 'components/SystemReboot.vue'
import Shutdown from 'components/SystemShutdown.vue'
import { supervisor } from 'src/api/supervisor'
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LayoutsMainLayout',

  components: {
    MenuItems,
    Reboot,
    Shutdown
  },

  setup() {
    const $router = useRouter()

    const deviceName = ref<string>()
    const changingLang = ref<boolean>(false)
    const networkDown = ref<boolean>(false)
    const networkUp = ref<boolean>(false)

    onMounted(() => {
      void getDeviceName()
    })

    // Import and activate language
    async function changeLang(isoName: string) {
      // Start loading indicator
      changingLang.value = true
      // Load the language and set it as the current language
      await loadLanguageAsync(isoName)

      changingLang.value = false
    }

    async function getDeviceName() {
      if (process.env.ON_DEVICE) {
        const response = (await supervisor.device_name()) as AxiosResponse<{
          deviceName: string
        }>
        deviceName.value = response.data.deviceName
      }
    }

    // Listeners for network status
    // When network is available again
    window.addEventListener('online', () => {
      networkDown.value = false
      networkUp.value = true
      setTimeout(() => {
        networkUp.value = false
      }, 3000)
    })

    // When network is down
    window.addEventListener('offline', () => {
      networkDown.value = true
    })

    return {
      changeLang,
      changingLang,
      currentLink: ref($router.currentRoute.value.name),
      deviceName,
      leftDrawerOpen: ref<boolean>(false),
      localeOptions,
      menuItems: menuList,
      networkDown,
      networkUp,
      qHeaderStyle
    }
  }
})
</script>
