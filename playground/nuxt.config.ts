import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-09-14',
  build: {
    transpile: ['wrdu-keyboard']
  },
  vite: {
    optimizeDeps: {
      include: ['wrdu-keyboard']
    },
    resolve: {
      alias: {
        'wrdu-keyboard': resolve(__dirname, 'node_modules', 'wrdu-keyboard', 'dist', 'keyboard.js')
      }
    }
  }
})
