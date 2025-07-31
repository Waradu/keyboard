import { onBeforeUnmount } from 'vue';
import type { Handler, Config } from '@waradu/keyboard'
import { Key } from '@waradu/keyboard'
import { useNuxtApp } from "nuxt/app";

export function useKeybind(
  keys: [Key, ...Key[]],
  handler: Handler,
  config?: Config
) {
  const { $keyboard } = useNuxtApp();
  const off = $keyboard.listen(keys, handler, config);
  onBeforeUnmount(() => {
    off();
  });
}