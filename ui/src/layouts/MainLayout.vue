<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ $t('title') }}
        </q-toolbar-title>

        <div>
          <Restart />
        </div>

        <div>
          <Shutdown />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-item-label
        header
      >
        {{ $t('control_panel') }}
      </q-item-label>
      <MenuItems
        v-for="link in menuItems"
        :key="link.label"
        v-bind="link"
      />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MenuItems from 'components/MenuItems.vue'
import Restart from 'src/components/Reboot.vue'
import Shutdown from 'src/components/Shutdown.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    MenuItems,
    Restart,
    Shutdown
  },

  setup () {
    const leftDrawerOpen = ref(false)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const menuList = [
      {
        icon: 'home',
        label: t('Home'),
        path: 'home'
      },
      {
        icon: 'book',
        label: t('Documentation'),
        path: 'documentation'
      },
      {
        icon: 'router',
        label: t('Networking'),
        path: 'networking'
      },
      {
        icon: 'update',
        label: t('Update'),
        path: 'update'
      },
      {
        icon: 'settings',
        label: t('Settings'),
        path: 'settings'
      }
    ]

    // A simple redirect to another page
    function redirect (path: string) {
      window.open(path)
    }

    return {
      menuItems: menuList,
      leftDrawerOpen,
      redirect,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
