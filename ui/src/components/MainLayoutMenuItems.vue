<template>
  <q-item
    v-ripple:secondary
    clickable
    active-class="bg-grey-3"
    @click="redirectTo(path)"
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
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayoutMenuItems',
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
    const $router = useRouter()

    async function redirectTo(path: string) {
      await $router.replace({ name: path })
    }
    return { redirectTo }
  }
})
</script>
