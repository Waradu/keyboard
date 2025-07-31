import { defineNuxtModule, addPlugin, createResolver, addImports } from "@nuxt/kit";
import type { Nuxt } from "@nuxt/schema";


export interface ModuleOptions {
  debug?: boolean | undefined;
}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: "@waradu/keyboard/nuxt", configKey: "keyboard" },
  defaults: {
    debug: false
  },
  setup(options: ModuleOptions, nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.keyboard = {
      debug: options.debug ?? false
    };

    addPlugin({
      src: resolve("./runtime/plugin"),
    });
    addImports({
      as: "useKeybind",
      name: "useKeybind",
      from: resolve("./runtime/composable")
    });
  }
});