<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section :class="rowClass">
      <template v-for="(child, index) in props.components" :key="child.name">
        <!-- If the first item passed, do not apply margins to top or sides -->
        <div v-if="index.toString() === '0'">
          <component :is="child"></component>
        </div>
        <!-- If NOT the first item, apply margins -->
        <div v-else :class="componentSpacing">
          <component :is="child"></component>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IntComponentFrame',
  props: {
    components: {
      type: Object,
      default: () => ({})
    },
    rows: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const componentSpacing = ref<string>('q-mt-md')
    const rowClass = ref<string>('')

    if (props.rows) {
      componentSpacing.value = 'q-ml-md'
      rowClass.value = 'row'
    }
    return { componentSpacing, props, rowClass }
  }
})
</script>
