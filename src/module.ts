import { defineNuxtModule, addPlugin, createResolver, addImports } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'wrdu-keyboard',
    configKey: 'wrduKeyboard',
    compatibility: {
      nuxt: '>=3.10.0',
    },
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    const composables = resolver.resolve('./runtime/composables')
    addImports([
      {
        from: composables,
        name: 'useKeyboard',
      },
    ])

    addPlugin(resolver.resolve('./runtime/keyboard'))
  },
})
