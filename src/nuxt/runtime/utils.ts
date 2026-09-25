import { detectOsInBrowser } from "../../helper";
import type { Keybind } from "../../keybind";
import type { AnyKey, KeyValue } from "../../keys";
import type { Os } from "../../types";

const nuxtUiKeyMap: Partial<Record<KeyValue | AnyKey, string>> = {
  enter: "enter",
  delete: "delete",
  backspace: "backspace",
  escape: "escape",
  tab: "tab",
  home: "home",
  end: "end",
  "arrow-up": "arrowup",
  "arrow-right": "arrowright",
  "arrow-down": "arrowdown",
  "arrow-left": "arrowleft",
  "page-up": "pageup",
  "page-down": "pagedown",
};

export function toNuxtUiKeys(keybind: Keybind, config: { platform?: Os } = {}): string[] {
  const parts: string[] = [];

  if (keybind.modifiers.meta) {
    const platform =
      config.platform ?? (keybind.platform === "macos" ? "macos" : detectOsInBrowser());
    parts.push(platform === "macos" ? "command" : "win");
  }
  if (keybind.modifiers.ctrl) parts.push("ctrl");
  if (keybind.modifiers.ctrlCmd) parts.push("meta");
  if (keybind.modifiers.alt) parts.push("alt");
  if (keybind.modifiers.shift) parts.push("shift");

  parts.push(nuxtUiKeyMap[keybind.key] ?? keybind.toReadableKey());

  return parts;
}
