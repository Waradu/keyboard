import { Key } from "./types/keys";

type Handler = (event: KeyboardEvent) => void;

type KeyHandler = {
  prevent: boolean;
  handler: Handler;
  once: boolean;
};

interface Handlers {
  down: {
    [key: string]: KeyHandler[];
  };
  up: {
    [key: string]: KeyHandler[];
  };
}

const getKeyString = (keys: Key[]): string =>
  keys[0] == Key.All ? "All" : keys.sort().join("+");

const handlers: Handlers = {
  down: {},
  up: {},
};

const pressedKeys = new Set<Key>();

const isEditableElement = (element: Element): boolean => {
  const editableElements = ['INPUT', 'TEXTAREA', '[contenteditable="true"]'];
  return editableElements.some(selector => element.matches(selector));
};

const handleAll = (event: KeyboardEvent, type: "up" | "down"): void => {
  if (isEditableElement(event.target as Element)) return;
  const allHandlers = handlers[type]["All"];
  if (allHandlers?.length) {
    allHandlers.forEach((eventHandler) => {
      if (eventHandler.prevent) event.preventDefault();
      eventHandler.handler(event);
      if (eventHandler.once) {
        handlers[type]["All"] = (handlers[type]["All"] || []).filter(
          (h) => h !== eventHandler
        );
        console.log(`Unregistered 'All' handler for ${type}`);
      }
    });
  }
};

const onKeydown = (event: KeyboardEvent): void => {
  if (isEditableElement(event.target as Element)) return;
  pressedKeys.add(event.code as Key);
  const pressedArray = Array.from(pressedKeys) as Key[];
  const keyString = getKeyString(pressedArray);
  const keyHandlers = handlers.down[keyString];
  if (keyHandlers?.length) {
    keyHandlers.forEach((eventHandler) => {
      if (eventHandler.prevent) event.preventDefault();
      eventHandler.handler(event);
      if (eventHandler.once) {
        handlers.down[keyString] = (handlers.down[keyString] || []).filter(
          (h) => h !== eventHandler
        );
        console.log(`Unregistered '${keyString}' handler for keydown`);
      }
    });
  }
  handleAll(event, "down");
};

const onKeyup = (event: KeyboardEvent): void => {
  if (isEditableElement(event.target as Element)) return;
  const releasedArray = Array.from(pressedKeys) as Key[];
  const keyString = getKeyString(releasedArray);
  const keyHandlers = handlers.up[keyString];
  if (keyHandlers?.length) {
    keyHandlers.forEach((eventHandler) => {
      if (eventHandler.prevent) event.preventDefault();
      eventHandler.handler(event);
      if (eventHandler.once) {
        handlers.up[keyString] = (handlers.up[keyString] || []).filter(
          (h) => h !== eventHandler
        );
        console.log(`Unregistered '${keyString}' handler for keyup`);
      }
    });
  }
  handleAll(event, "up");
  pressedKeys.delete(event.code as Key);
};

const clear = (): void => {
  handlers.down = {};
  handlers.up = {};
  pressedKeys.clear();
  console.log("Cleared all keyboard handlers");
};

const stop = (): void => {
  if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("keyup", onKeyup);
  }
};

const init = (): void => {
  stop();
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    console.log("Initializing keyboard event listeners");
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
  }
};

type Config = {
  once?: boolean;
  prevent?: boolean;
};

const down = (keys: Key[], handler: Handler, config: Config = {}): void => {
  if (keys.includes(Key.All)) {
    keys = [Key.All];
  }
  if (keys.length === 0) {
    throw new Error("At least one key must be provided");
  }
  const key = getKeyString(keys);
  const { once = false, prevent = false } = config;
  handlers.down[key] = [{ handler, prevent, once }];
  console.log(`Registered '${key}' handler for keydown`);
};

const up = (keys: Key[], handler: Handler, config: Config = {}): void => {
  if (keys.includes(Key.All)) {
    keys = [Key.All];
  }
  if (keys.length === 0) {
    throw new Error("At least one key must be provided");
  }
  const key = getKeyString(keys);
  const { once = false, prevent = false } = config;
  handlers.up[key] = [{ handler, prevent, once }];
  console.log(`Registered '${key}' handler for keyup`);
};

export interface Keyboard {
  init: () => void;
  stop: () => void;
  clear: () => void;
  down: (keys: Key[], handler: Handler, config?: Config) => void;
  up: (keys: Key[], handler: Handler, config?: Config) => void;
  prevent: {
    down: (keys: Key[], handler: Handler, config?: Omit<Config, "prevent">) => void;
    up: (keys: Key[], handler: Handler, config?: Omit<Config, "prevent">) => void;
  };
}

export const keyboard: Keyboard = {
  init,
  stop,
  clear,
  down,
  up,
  prevent: {
    down: (keys, handler, config = {}) => down(keys, handler, { ...config, prevent: true }),
    up: (keys, handler, config = {}) => up(keys, handler, { ...config, prevent: true }),
  },
};

export { Key } from "./types/keys";
