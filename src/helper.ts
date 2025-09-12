export const isEditableElement = (element: Element): boolean => {
  const editableElements = ["INPUT", "TEXTAREA", '[contenteditable="true"]', '[contenteditable="plaintext-only"]'];
  return editableElements.some((selector) => element.matches(selector));
};
