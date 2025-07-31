import type { useKeyboard } from '@waradu/keyboard';
import type { ModuleOptions } from '../index';

type KeyboardInstance = ReturnType<typeof useKeyboard>;

declare module 'nuxt/app' {
  interface NuxtApp {
    $keyboard: KeyboardInstance;
  }
}

declare module '#app' {
  interface NuxtApp {
    $keyboard: KeyboardInstance;
  }
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    keyboard: Partial<ModuleOptions>;
  }
}