import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';
import type { ModuleOptions, Nuxt } from '@nuxt/schema';

export default defineNuxtModule<ModuleOptions>({
  meta: { name: '@waradu/keyboard/nuxt', configKey: 'keyboard' },
  defaults: {},
  setup(_options: ModuleOptions, nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url);
    addPlugin(resolve('./runtime/plugin'));
  }
});