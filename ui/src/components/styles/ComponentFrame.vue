<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section>
      <template v-for="child in props.component" :key="child.name">
        <component :is="child"></component>
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntComponentFrame',
  props: {
    component: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    return { props }
  }
})
</script>
