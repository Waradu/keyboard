import { useKeyboard } from "@waradu/keyboard";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  const { public: { keyboard: opts } } = useRuntimeConfig();

  const keyboard = useKeyboard({
    debug: opts.debug
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