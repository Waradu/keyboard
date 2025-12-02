import type { useKeyboard } from "@waradu/keyboard";
import type { ModuleOptions } from "./index";
import type { Directive } from "vue";
import type { vKeybind, vRun } from "./runtime/directives/keybind";
export * from "./index";

type KeyboardInstance = ReturnType<typeof useKeyboard>;

declare module "nuxt/app" {
  interface NuxtApp {
    $keyboard: KeyboardInstance;
  }
}

declare module "@vue/runtime-core" {
  interface GlobalDirectives {
    vKeybind: typeof vKeybind;
    vRun: typeof vRun;
  }
}

declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    keyboard: Partial<ModuleOptions>;
  }
}

export { };
