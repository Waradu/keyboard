import { Key } from "./keys";

export const getKeyString = (keys: Key[]): string => {
  if (keys[0] == Key.All) return "All";

  keys = keys.map((key) => (key === "ShiftLeft" || key === "ShiftRight" ? "Shift" : key));
  keys = keys.map((key) => (key === "AltLeft" || key === "AltRight" ? "Alt" : key));
  keys = keys.map((key) => (key === "ControlLeft" || key === "ControlRight" ? "Control" : key));
  keys = keys.map((key) => (key === "MetaLeft" || key === "MetaRight" ? "Meta" : key));

  const deduplicatedKeys = Array.from(new Set(keys));

  return deduplicatedKeys.sort().join("+");
};

export const isEditableElement = (element: Element): boolean => {
  const editableElements = ["INPUT", "TEXTAREA", '[contenteditable="true"]'];
  return editableElements.some((selector) => element.matches(selector));
};
