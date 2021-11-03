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
          Balena Device UI
        </q-toolbar-title>

        <div>
          <q-btn
            icon="code"
            flat
            size="sm"
            @click="redirect('https://github.com/maggie0002/balena-device-ui')"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          {{ $t('control_panel') }}
        </q-item-label>
        <q-list>
          <template
            v-for="(menuItem, index) in menuList"
            :key="index"
          >
            <q-item
              v-ripple
              clickable
              :active="index === activeMenuItem"
              @click="activeMenuItem = index; $router.replace({ name: menuItem.path })"
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator
              v-if="menuItem.separator"
              :key="'sep' + index"
            />
          </template>
        </q-list>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { t } = useI18n()

    const menuList = [
      {
        icon: 'home',
        label: t('Home'),
        path: 'home',
        separator: false
      },
      {
        icon: 'book',
        label: t('Documentation'),
        path: 'documentation',
        separator: false
      },
      {
        icon: 'update',
        label: t('Update'),
        path: 'update',
        separator: true
      },
      {
        icon: 'settings',
        label: t('Settings'),
        path: 'settings',
        separator: false
      }
    ]

    // A simple redirect to another page
    function redirect (path: string) {
      window.open(path)
    }

    return {
      activeMenuItem: ref<number>(0),
      leftDrawerOpen,
      menuList,
      redirect,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
