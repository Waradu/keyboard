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
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    const composables = resolver.resolve('./runtime/composables')
    addImports([
      {
        from: composables,
        name: 'useKeyboard',
      },
    ])

    nuxt.hook('modules:done', () => {
      addPlugin(resolver.resolve('./runtime/keyboard'))
    })
  },
})
