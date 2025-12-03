import { onBeforeUnmount, ref } from "vue";
import type { useKeyboard } from "@waradu/keyboard";
import { useNuxtApp } from "nuxt/app";
import type { Handlers } from "@waradu/keyboard";

export function useKeybind(
  options: Parameters<ReturnType<typeof useKeyboard>["listen"]>[0]
) {
  const { $keyboard } = useNuxtApp() as unknown as { $keyboard: ReturnType<typeof useKeyboard>; };

  const off = $keyboard.listen(options);

  onBeforeUnmount(() => {
    off();
  });

  return off;
}

export function useKeyboardInspector() {
  const listeners = ref<Handlers>([]);

  return listeners;
}