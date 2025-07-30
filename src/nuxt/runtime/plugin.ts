import { useKeyboard } from "@waradu/keyboard";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  const keyboard = useKeyboard();

  nuxtApp.hook('app:mounted', () => {
    keyboard.init();
  });

  return {
    provide: {
      keyboard,
    },
  };
});