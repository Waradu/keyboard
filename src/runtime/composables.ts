import { useNuxtApp } from '#app'

export * from './keyboard'

export const useKeyboard = () => useNuxtApp().$keyboard
