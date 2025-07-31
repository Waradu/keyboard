import { getKeyString, isEditableElement } from "./helper";
import { Key } from "./keys";
import type { Handler, Config, Handlers, KeyboardConfig, Listener } from "./types";

/**
 * Create a keyboard listener.
 *
 * @param config Optional settings to configure the keyboard.
 */
export const useKeyboard = (config: KeyboardConfig = { debug: false }) => {
  const instanceSignal = config.signal;

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
      const t = event.target;
      if (listener.ignoreIfEditable && t && t instanceof Element && isEditableElement(t)) return;
      if (listener.runIfFocused === null) return;
      if (
        listener.runIfFocused &&
        document?.activeElement &&
        listener.runIfFocused !== document.activeElement
      )
        return;
      if (listener.prevent) event.preventDefault();
      if (listener.stop === true) event.stopPropagation();
      if (listener.stop === "immediate") event.stopImmediatePropagation();
      if (listener.stop === "both") { event.stopPropagation(); event.stopImmediatePropagation(); }

      listener.handler(event);
      log(`handled '${listener.id}'`);

      if (listener.once) unlisten(listener.id);
    });
  };

  const onKeyup = (event: KeyboardEvent): void => {
    pressedKeys.delete(event.code as Key);
    log(`released '${event.code}'`);
  };

  const onBlur = () => {
    if (pressedKeys.size) {
      pressedKeys.clear();
      log("cleared due to blur");
    }
  };

  const clear = (): void => {
    for (const arr of Object.values(listeners)) for (const l of arr) l.off?.();
    listeners = {};
    pressedKeys.clear();
    log(`cleared`);
  };

  const stop = (): void => {
    if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
      window.removeEventListener("blur", onBlur);
    }

    log("stopped");
  };

  const destroy = (): void => {
    stop();
    clear();
  };

  const init = (opts?: { signal?: AbortSignal; }) => {
    stop();
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      window.addEventListener("keydown", onKeydown);
      window.addEventListener("keyup", onKeyup);
      window.addEventListener("blur", onBlur);

      const abortSignal = opts?.signal ?? instanceSignal;
      if (abortSignal) {
        if (abortSignal.aborted) destroy();
        else abortSignal.addEventListener("abort", destroy, { once: true });
      }

      log("initialized");
    }
  };

  const unlisten = (id: string) => {
    Object.entries(listeners).forEach(([keyString]) => {
      const arr = listeners[keyString];
      if (!arr) return;
      const keep: Listener[] = [];
      for (const l of arr) {
        if (l.id === id) l.off?.();
        else keep.push(l);
      }
      if (keep.length) listeners[keyString] = keep;
      else delete listeners[keyString];
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

    if (config.signal?.aborted) return () => { };

    const keyString = getKeyString(keys);

    const id = Math.random().toString(36).slice(2, 7);

    const onAbort = () => unlisten(id);
    if (config.signal) config.signal.addEventListener("abort", onAbort, { once: true });

    if (!listeners[keyString]) listeners[keyString] = [];

    listeners[keyString].push({ ...config, handler, id, off: () => config.signal?.removeEventListener("abort", onAbort) });

    log(`added '${keyString}' with id: '${id}'`);

    return () => {
      if (config.signal) config.signal.removeEventListener("abort", onAbort);
      unlisten(id);
    };
  };

  return {
    /**
     * Initialize the keyboard. Call this when `window` is available (it will fail silently).
     * You can define listeners bevore initializing.
     */
    init,
    /**
     * Removes all event handlers.
     * To re-enable listening after calling this, call `init()` again.
     */
    stop,
    /**
     * Removes all event handlers and clears any stored key state.
     * Use this if you are not planning to re-enable listening with `init()` after.
     */
    destroy,
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

export { Key, type Handler, type Config };
