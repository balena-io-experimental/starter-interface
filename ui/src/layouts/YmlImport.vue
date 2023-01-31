<template>
  <q-page class="q-pa-lg">
    <component-frame
      v-for="componentList in components"
      :key="componentList[0].name"
      :components="componentList"
      :rows="componentList[0].rows"
      :title="componentList[0].title"
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
    interface Components {
      [index: string]: {
        component: { [key: string]: unknown }
        name: string
        rows: boolean
        title: string
      }[]
    }

    const route = useRoute()

    const components = {} as Components
    const componentFiles = import.meta.glob('src/components/*.vue')
    const routeName = route.name as string

    Object.keys(configYml.pages[routeName].frames).forEach(
      (element: string) => {
        const component = configYml.pages[routeName].frames[
          element
        ].components.map((ymlArray) => ({
          component: defineAsyncComponent(
            componentFiles[`../components/${ymlArray}.vue`]
          ),
          name: ymlArray,
          rows: configYml.pages[routeName].frames[element].rows,
          title: configYml.pages[routeName].frames[element].title
        }))

        components[element] = component
      }
    )

    return { components }
  }
})
</script>
