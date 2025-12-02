import { resolve } from 'pathe';

//@ts-ignore
export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@nuxt/devtools-ui-kit',
  ],

  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },

  app: {
    baseURL: '/__keyboard',
  },

  vite: {
    server: {
      hmr: {
        clientPort: +(process.env.PORT || 3300),
      },
    },
  },

  devtools: {
    enabled: false,
  },

  compatibilityDate: '2024-08-21',
});
