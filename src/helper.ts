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