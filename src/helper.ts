import type { KeySequence, KeyString, KeyValue, ModifierValue, PlatformValue } from "./keys";
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

interface FormattedKeySequence {
  platform?: PlatformValue;
  modifiers: ModifierValue[];
  key: KeyValue | "any";
}

/**
 * Parse a key string into parts.
 */
export const parseKeyString = (sequence: KeyString): FormattedKeySequence => {
  if (sequence === "any") return {
    key: "any",
    modifiers: []
  };

  let platformLabel: PlatformValue | undefined;
  let keySequence: KeySequence = sequence as KeySequence;

  if (sequence.includes(":")) {
    const [platform, seq] = sequence.split(":") as [PlatformValue, KeySequence];
    platformLabel = platform;
    keySequence = seq;
  }

  const parts = keySequence.split("_") as ModifierValue[];
  const key = parts.pop() as KeyValue;

  return {
    platform: platformLabel,
    modifiers: parts,
    key: key
  };
};