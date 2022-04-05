<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section>
      <template v-for="(child, index) in props.components" :key="child.name">
        <!-- If the first item passed, do not apply margins to top -->
        <div v-if="index.toString() === '0'">
          <component :is="child"></component>
        </div>
        <!-- If NOT the first item, apply margins to top -->
        <div v-else class="q-mt-md">
          <component :is="child"></component>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IntComponentFrame',
  props: {
    components: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    return { props }
  }
})
</script>
