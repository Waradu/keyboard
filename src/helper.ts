import { keys, modifiers, platforms, type KeySequence, type KeyString, type KeyValue, type ModifierValue, type PlatformValue } from "./keys";
import type { Os } from "./types";

export const isEditableElement = (element: Element): boolean => {
  const editableElements = ["INPUT", "TEXTAREA", '[contenteditable="true"]', '[contenteditable="plaintext-only"]'];
  return editableElements.some((selector) => element.matches(selector));
};

export async function detectOsInBrowser(): Promise<Os> {
  const nav = navigator as any;

  if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === "function") {
    try {
      const { platform } = await nav.userAgentData.getHighEntropyValues(["platform"]);
      const p = String(platform || "").toLowerCase();
      if (p.includes("mac")) return "macos";
      if (p.includes("win")) return "windows";
      if (p.includes("linux") || p.includes("chrome os")) return "linux";
    } catch { }
  }

  const plat = (navigator.platform || "").toLowerCase();
  const ua = (navigator.userAgent || "").toLowerCase();

  if (plat.includes("mac") || ua.includes("mac os x")) return "macos";
  if (plat.includes("win") || ua.includes("windows")) return "windows";
  if (plat.includes("linux") || ua.includes("x11") || ua.includes("cros")) return "linux";

  return "unknown";
}

export interface FormattedKeySequence {
  platform?: PlatformValue;
  modifiers: ModifierValue[];
  key: KeyValue | "any";
}

/**
 * Parse a key string into parts. Returns `undefined` if the string is invalid.
 */
export const parseKeyString = (sequence: KeyString): FormattedKeySequence | undefined => {
  if (sequence === "any") {
    return {
      key: "any",
      modifiers: [],
    };
  }

  let platformLabel: PlatformValue | undefined;
  let keySequence: KeySequence = sequence as KeySequence;

  if (sequence.includes(":")) {
    const [platform, seq] = sequence.split(":") as [PlatformValue, KeySequence];
    if (!Object.values(platforms).includes(platform)) return;
    platformLabel = platform;
    keySequence = seq;
  }

  const parts = keySequence.split("_");
  if (parts.length === 0) return;

  const key = parts.pop() as KeyValue;
  const validKeyValues = new Set(Object.values(keys));
  if (!validKeyValues.has(key)) return;

  const modOrder: ModifierValue[] = ["meta", "control", "alt", "shift"];
  const modSet = new Set(Object.values(modifiers));

  const modifiersOnly = parts as ModifierValue[];

  let lastIndex = -1;
  for (const mod of modifiersOnly) {
    if (!modSet.has(mod)) return;
    const idx = modOrder.indexOf(mod);
    if (idx === -1 || idx < lastIndex) return;
    lastIndex = idx;
  }

  return {
    platform: platformLabel,
    modifiers: modifiersOnly,
    key: key,
  };
};
