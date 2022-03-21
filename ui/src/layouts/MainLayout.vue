<template>
  <q-layout view="hHh Lpr lFf">
    <q-header v-bind="qHeaderStyle.header">
      <q-toolbar>
        <q-btn
          color="secondary"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <router-link v-if="qHeaderStyle.logo" to="/">
          <q-avatar>
            <img :src="qHeaderStyle.logo" />
          </q-avatar>
        </router-link>

        <q-toolbar-title v-bind="qHeaderStyle.title">
          {{ $t('titles.title') }}
        </q-toolbar-title>

        <q-btn icon="translate" color="secondary" round flat dense>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                v-for="language in localeOptions"
                :key="language.value"
                v-close-popup
                clickable
                @click="locale = language.value"
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

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="225" bordered>
      <MenuItems v-for="link in menuItems" :key="link.label" v-bind="link" />
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
            {{ $t('network.network_connection_down') }}
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
            {{ $t('network.network_connection_restored') }}
          </q-banner>
        </q-slide-transition>
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import MenuItems from 'components/layouts/MenuItems.vue'
import menuList from 'components/styles/menuList'
import { qHeaderStyle } from 'components/styles/qStyles'
import { useQuasar } from 'quasar'
import Reboot from 'components/system/Reboot.vue'
import Shutdown from 'components/system/Shutdown.vue'
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { QuasarLanguage } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {
    MenuItems,
    Reboot,
    Shutdown
  },

  setup() {
    const $q = useQuasar()

    const leftDrawerOpen = ref(false)
    const { locale } = useI18n({ useScope: 'global' })
    const networkDown = ref<boolean>(false)
    const networkUp = ref<boolean>(false)

    // Langauges need to be added here.
    const localeOptions = [
      { value: 'en-US', label: 'English' },
      { value: 'de', label: 'Deutsch' },
      { value: 'fr', label: 'Français' },
      { value: 'it', label: 'Italiano' },
      { value: 'nb-NO', label: 'Norsk' },
      { value: 'pt-BR', label: 'Português' }
    ]

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

    // Quasar requires the Quasar language pack to be set seperate from Vue i18n
    watch(locale, (val) => {
      // Dynamic import, so loading on demand only
      import(`./quasar/lang/${val}/index.js`)
        .then((lang: { default: QuasarLanguage }) => {
          $q.lang.set(lang.default)
          $q.localStorage.set('lang', lang.default.isoName)
        })
        .catch(() => {
          console.log(
            "User's browser language is not available. Reverting to en-US."
          )
        })
    })

    // Set language to previously chosen, otherwise use browser default
    if (localStorage.getItem('lang')) {
      locale.value = $q.localStorage.getItem('lang') as string
    } else {
      locale.value = $q.lang.getLocale() as string
    }

    return {
      leftDrawerOpen,
      locale,
      localeOptions,
      menuItems: menuList,
      networkDown,
      networkUp,
      qHeaderStyle,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
