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

const getKeyString = (keys: Key[]) =>
  keys[0] == Key.All ? "All" : keys.sort().join("+");

const handlers: Handlers = {
  down: {},
  up: {},
};

const pressedKeys = new Set<Key>();

const handleAll = (event: KeyboardEvent, type: "up" | "down") => {
  if (handlers[type]["All"]) {
    handlers[type]["All"].forEach((eventHandler) => {
      if (eventHandler.prevent) event.preventDefault();
      eventHandler.handler(event);
      if (eventHandler.once) {
        handlers[type]["All"] = handlers[type]["All"].filter(
          (h) => h !== eventHandler
        );
      }
    });
  }
};

const onKeydown = (event: KeyboardEvent) => {
  pressedKeys.add(event.code as Key);
  const pressedArray = Array.from(pressedKeys) as Key[];
  const keyString = getKeyString(pressedArray);
  if (handlers.down[keyString]) {
    handlers.down[keyString].forEach((eventHandler) => {
      if (eventHandler.prevent) event.preventDefault();
      eventHandler.handler(event);
      if (eventHandler.once) {
        handlers.down[keyString] = handlers.down[keyString].filter(
          (h) => h !== eventHandler
        );
      }
    });
  }
  handleAll(event, "down");
};

const onKeyup = (event: KeyboardEvent) => {
  const releasedArray = Array.from(pressedKeys) as Key[];
  const keyString = getKeyString(releasedArray);
  if (handlers.up[keyString]) {
    handlers.up[keyString].forEach((eventHandler) => {
      if (eventHandler.prevent) event.preventDefault();
      eventHandler.handler(event);
      if (eventHandler.once) {
        handlers.up[keyString] = handlers.up[keyString].filter(
          (h) => h !== eventHandler
        );
      }
    });
  }
  handleAll(event, "up");
  pressedKeys.delete(event.code as Key);
};

const clear = () => {
  handlers.down = {};
  handlers.up = {};
  pressedKeys.clear();
};

const stop = () => {
  if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("keyup", onKeyup);
  }
};

const init = () => {
  stop();
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
  }
};

type Config = {
  once?: boolean;
  prevent?: boolean;
};

const down = (keys: Key[], handler: Handler, config: Config = {}) => {
  if (keys.includes(Key.All)) {
    keys = [Key.All];
  }
  if (keys.length === 0) {
    throw new Error("At least one key must be provided");
  }
  const key = getKeyString(keys);
  if (!handlers.down[key]) {
    handlers.down[key] = [];
  }
  const { once = false, prevent = false } = config;
  handlers.down[key].push({ handler, prevent, once });
};

const up = (keys: Key[], handler: Handler, config: Config = {}) => {
  if (keys.includes(Key.All)) {
    keys = [Key.All];
  }
  if (keys.length === 0) {
    throw new Error("At least one key must be provided");
  }
  const key = getKeyString(keys);
  if (!handlers.up[key]) {
    handlers.up[key] = [];
  }
  const { once = false, prevent = false } = config;
  handlers.up[key].push({ handler, prevent, once });
};

export interface Keyboard {
  init: () => void;
  stop: () => void;
  clear: () => void;
  down: (keys: Key[], handler: Handler, config?: Config) => void;
  up: (keys: Key[], handler: Handler, config?: Config) => void;
  prevent: {
    down: (
      keys: Key[],
      handler: Handler,
      config?: Omit<Config, "prevent">
    ) => void;
    up: (
      keys: Key[],
      handler: Handler,
      config?: Omit<Config, "prevent">
    ) => void;
  };
}

export const keyboard: Keyboard = {
  init,
  stop,
  clear,
  down,
  up,
  prevent: {
    down: (keys, handler, config = {}) =>
      down(keys, handler, { ...config, prevent: true }),
    up: (keys, handler, config = {}) =>
      up(keys, handler, { ...config, prevent: true }),
  },
};

export { Key } from "./types/keys";
