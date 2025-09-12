import { onBeforeUnmount } from 'vue';
import type { Options, useKeyboard } from '@waradu/keyboard';
import { useNuxtApp } from "nuxt/app";

export function useKeybind(
  options: Options
) {
  const { $keyboard } = useNuxtApp() as unknown as { $keyboard: ReturnType<typeof useKeyboard>; };
  const off = $keyboard.listen(options);
  onBeforeUnmount(() => {
    off();
  });
}