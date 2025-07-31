import { getKeyString, isEditableElement } from "./helper";
import { Key } from "./keys";
import type { Handler, Config, Handlers, KeyboardConfig, Listener } from "./types";

/**
 * Create a keyboard listener.
 *
 * @param config Optional settings to configure the keyboard.
 */
export const useKeyboard = (config: KeyboardConfig = { debug: false }) => {
  const log = (text: string) => {
    if (config.debug) console.log(`<KEYBOARD> ${text}`);
  };

  let listeners: Handlers = {};
  const pressedKeys = new Set<Key>();

  const onKeydown = (event: KeyboardEvent): void => {
    pressedKeys.add(event.code as Key);
    log(`pressed '${event.code}'`);

    const pressedArray = Array.from(pressedKeys) as Key[];
    const actualKeyString = getKeyString(pressedArray);

    const strippedArray = pressedArray.filter(
      (code) => code !== "ShiftLeft" && code !== "ShiftRight",
    );
    const strippedKeyString = getKeyString(strippedArray);

    const candidates: Listener[] = [];

    if (listeners["All"]) {
      candidates.push(...listeners["All"]);
    }

    if (listeners[actualKeyString]) {
      candidates.push(...listeners[actualKeyString]);
    }

    if (strippedKeyString !== actualKeyString && listeners[strippedKeyString]) {
      const ignoreCaseListeners = listeners[strippedKeyString].filter((l) => l.ignoreCase);
      candidates.push(...ignoreCaseListeners);
    }

    if (candidates.length === 0) return;

    const uniqueMap = new Map<string, Listener>();
    for (const l of candidates) {
      uniqueMap.set(l.id, l);
    }
    const keyListeners = Array.from(uniqueMap.values());

    keyListeners.forEach((listener) => {
      if (listener.ignoreIfEditable && isEditableElement(event.target as Element)) return;
      if (listener.runIfFocused === null) return;
      if (
        listener.runIfFocused &&
        document?.activeElement &&
        listener.runIfFocused !== document.activeElement
      )
        return;
      if (listener.prevent) event.preventDefault();
      if (listener.stop == true) event.stopPropagation();
      if (listener.stop == "immediate") event.stopImmediatePropagation();
      if (listener.stop == "both") { event.stopPropagation(); event.stopImmediatePropagation(); }

      listener.handler(event);
      log(`handled '${listener.id}'`);

      if (listener.once) unlisten(listener.id);
    });
  };

  const onKeyup = (event: KeyboardEvent): void => {
    pressedKeys.delete(event.code as Key);
    log(`released '${event.code}'`);
  };

  const clear = () => {
    listeners = {};
    pressedKeys.clear();
    log(`cleared`);
  };

  const stop = (): void => {
    if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    }
    log("stopped");
  };

  const init = (): void => {
    stop();
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      window.addEventListener("keydown", onKeydown);
      window.addEventListener("keyup", onKeyup);
      log("initialized");
    }
  };

  const unlisten = (id: string) => {
    Object.entries(listeners).forEach(([keyString]) => {
      if (!listeners[keyString]) return;
      listeners[keyString] = listeners[keyString].filter((c) => c.id !== id);
    });
    log(`removed: '${id}'`);
  };

  const listen = (keys: [Key, ...Key[]], handler: Handler, config: Config = {}) => {
    if ("runIfFocused" in config && config.runIfFocused === undefined) {
      config.runIfFocused = null;
    }

    config = {
      prevent: false,
      stop: false,
      ignoreIfEditable: false,
      once: false,
      ...config,
    };

    if (keys.includes(Key.All)) {
      keys = [Key.All];
    }

    if (keys.length === 0) {
      throw new Error("At least one key must be provided");
    }

    const keyString = getKeyString(keys);

    const id = Math.random().toString(36).slice(2, 7);

    if (!listeners[keyString]) listeners[keyString] = [];

    listeners[keyString].push({ ...config, handler, id });

    log(`added '${keyString}' with id: '${id}'`);

    return () => unlisten(id);
  };

  return {
    /**
     * Initialize the keyboard. Call this when `window` is available.
     * You can define listeners bevore initializing.
     */
    init,
    /**
     * Stop listening.
     */
    stop,
    /**
     * Clear all listeners.
     */
    clear,
    /**
     * Create new listener.
     *
     * @param keys Key sequence to listen to.
     * @param handler Handler function.
     * @param config Optional settings to configure the listener.
     * @returns Unlisten function
     *
     * @example
     * ```ts
     * const unlisten = keyboard.listen([Key.Alt, Key.A], () => {
     *   message.value = "Alt + A key pressed";
     * });
     *
     * unlisten();
     * ```
     */
    listen,
  };
};

export { Key };
