<!--
ComponentFrame.vue provides the white box from which other components are rendered within. It
allows for standardisation of components and for interactive/auto configuring of visual
components. See the Wiki on Github for more details.
 -->

<template>
  <q-card flat bordered class="q-mb-md" :class="props.class">
    <q-item-label v-if="props.title" class="q-mt-sm" overline>
      {{ props.title }}
    </q-item-label>
    <q-card-section :class="rowClass">
      <template v-for="(child, index) in props.components" :key="child.name">
        <!-- If the first item passed, do not apply margins to top or sides -->
        <div v-if="index.toString() === '0'">
          <component :is="child.component" v-bind="child.sentProps"></component>
        </div>
        <!-- If NOT the first item, apply margins -->
        <div v-else :class="componentSpacing">
          <component :is="child.component" v-bind="child.sentProps"></component>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ComponentFrame',
  props: {
    class: {
      type: String,
      default: ''
    },
    components: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    rows: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const componentSpacing = ref<string>('q-mt-sm')
    const rowClass = ref<string>('')

    if (props.rows) {
      componentSpacing.value = 'q-ml-md'
      rowClass.value = 'row'
    }
    return { componentSpacing, props, rowClass }
  }
})
</script>
