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
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import MenuItems from 'components/MenuItems.vue'
import menuList from '../components/styles/menuList'
import { qHeaderStyle } from '../components/styles/qStyles'
import { useQuasar } from 'quasar'
import Reboot from 'src/components/Reboot.vue'
import Shutdown from 'src/components/Shutdown.vue'
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

    // Quasar requires the Quasar language pack to be set seperate from Vue i18n
    watch(locale, (val) => {
      // Dynamic import, so loading on demand only
      import(
        // Set which Quasar language packs to import below:
        // https://quasar.dev/options/quasar-language-packs#dynamical-non-ssr-
        /* webpackInclude: /(de|en-US)\.js$/ */
        `quasar/lang/${val}`
      )
        .then((lang: { default: QuasarLanguage }) => {
          $q.lang.set(lang.default)
          $q.localStorage.set('lang', lang.default.isoName)
        })
        .catch(() => {
          console.log(
            "User's browser language is not installed. Reverting to en-US."
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
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'de', label: 'German' }
      ],
      menuItems: menuList,
      qHeaderStyle,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
