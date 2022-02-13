<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      v-bind="qHeader.header"
    >
      <q-toolbar>
        <q-btn
          color="black"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <router-link
          v-if="qHeader.logo"
          to="/"
        >
          <q-avatar>
            <img :src="qHeader.logo">
          </q-avatar>
        </router-link>

        <q-toolbar-title v-bind="qHeader.title">
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
      :width="225"
      bordered
    >
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
import MenuItems from 'components/MenuItems.vue'
import menuList from '../components/styles/menuList'
import { qHeader } from '../components/styles/qStyles'
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

    return {
      leftDrawerOpen,
      menuItems: menuList,
      qHeader,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
