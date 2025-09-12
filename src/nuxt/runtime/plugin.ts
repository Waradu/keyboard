import { useKeyboard } from "@waradu/keyboard";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";
import type { ModuleOptions } from "../index";

export default defineNuxtPlugin((nuxtApp) => {
  const { public: { keyboard: opts } } = useRuntimeConfig();

  const keyboard = useKeyboard({
    debug: (opts as ModuleOptions).debug
  });

  nuxtApp.hook('app:mounted', () => {
    keyboard.init();
  });

  return {
    provide: {
      keyboard,
    },
  };
});