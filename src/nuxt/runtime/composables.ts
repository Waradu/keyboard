import { getCurrentInstance, onBeforeUnmount, ref } from "vue";
import type { useKeyboard } from "@waradu/keyboard";
import { useNuxtApp } from "nuxt/app";
import type { Handlers } from "@waradu/keyboard";

interface KeyboardNuxtApp { $keyboard: ReturnType<typeof useKeyboard>; }

export function useKeybind(
  options: Parameters<ReturnType<typeof useKeyboard>["listen"]>[0]
) {
  const { $keyboard } = useNuxtApp() as unknown as KeyboardNuxtApp;

  const vm = getCurrentInstance();
  const off = $keyboard.listen(options);

  if (vm) {
    onBeforeUnmount(() => {
      off();
    });
  }

  return off;
}

export function useKeyboardInspector() {
  const { $keyboard } = useNuxtApp() as unknown as KeyboardNuxtApp;

  const listeners = ref<Handlers>([]);

  let unsubscribe: (() => void) | undefined;

  unsubscribe = $keyboard.subscribe((handlers) => {
    listeners.value = handlers;
  });

  onBeforeUnmount(() => {
    unsubscribe?.();
  });

  return listeners;
}
