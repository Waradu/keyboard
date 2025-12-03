import { getCurrentInstance, onBeforeUnmount, ref } from "vue";
import type { useKeyboard } from "@waradu/keyboard";
import { useNuxtApp } from "nuxt/app";
import type { Handlers, KeySequence } from "@waradu/keyboard";

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

  const unsubscribe = $keyboard.subscribe((handlers) => {
    listeners.value = handlers;
  });

  onBeforeUnmount(() => {
    unsubscribe?.();
  });

  return { listeners, unsubscribe };
}

export function useKeybindRecorder(cb: (sequence: KeySequence) => void) {
  const { $keyboard } = useNuxtApp();

  const vm = getCurrentInstance();
  const off = $keyboard.record(cb);

  if (vm) {
    onBeforeUnmount(() => {
      off();
    });
  }

  return off;
}
