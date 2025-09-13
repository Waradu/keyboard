import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ['../src/nuxt/index'],
  keyboard: {
    debug: true
  },
  devtools: { enabled: false },
});
