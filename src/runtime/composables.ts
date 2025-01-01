import type { Keyboard } from './keyboard'
import { useNuxtApp } from '#app'

export * from './keyboard'

export const useKeyboard = (): Keyboard => useNuxtApp().$keyboard
