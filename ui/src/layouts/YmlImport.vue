<template>
  <q-page class="q-pa-lg">
    <component-frame
      v-for="componentList in components"
      :key="componentList[0].component.name"
      :components="componentList"
    />
  </q-page>
</template>

<script lang="ts">
import ComponentFrame from 'layouts/ComponentFrame.vue'
import { configYml } from 'src/boot/ymlImport'
import { defineAsyncComponent, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  components: {
    ComponentFrame
  },
  setup() {
    const route = useRoute()

    const componentFiles = import.meta.glob('src/components/*.vue')
    const routeName = route.name as string

    // For each component item of this page in the yml file, define the async components
    const components = configYml.pages[routeName].components.map((ymlArray) =>
      ymlArray.map((component) => ({
        component: defineAsyncComponent(
          componentFiles[`../components/${component}.vue`]
        )
      }))
    )

    return { components }
  }
})
</script>
