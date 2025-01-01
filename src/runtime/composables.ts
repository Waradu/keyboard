import { Key } from '../types/keys'
import type { Keyboard } from './keyboard'
import { useNuxtApp } from '#app'

export * from './keyboard'
export { Key }

export const useKeyboard = (): Keyboard => useNuxtApp().$keyboard
