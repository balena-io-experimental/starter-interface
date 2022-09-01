<template>
  <q-item
    v-ripple:secondary
    clickable
    active-class="bg-grey-3"
    @click="clickedLink(path)"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LayoutsMenuItems',
  props: {
    label: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  setup() {
    const $q = useQuasar()
    const $router = useRouter()

    async function clickedLink(path: string) {
      // Starts the loading indicator here, then stops it in the
      // router.afterEach function in ui/src/router
      $q.loading.show()
      await $router.replace({ name: path })
    }
    return { clickedLink }
  }
})
</script>
