import { isEditableElement } from "./helper";
import { keys, modifiers, type KeyKey, type KeyString, type KeyValue, type ModifierKey, type ModifierValue } from "./keys";
import type { Config, Handlers, KeyboardConfig, Handler, Listener, Options } from "./types";

/**
 * Create a keyboard listener.
 *
 * @param config Optional settings to configure the keyboard.
 */
export const useKeyboard = (config: KeyboardConfig = { debug: false }) => {
  const instanceSignal = config.signal;
  let listeners: Handlers = [];

  const pressedKeys = new Set<KeyValue>();
  const pressedModifiers = new Set<ModifierValue>();

  const log = (text: string) => {
    if (config.debug) console.log(`<KEYBOARD> ${text}`);
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.isComposing) return;

    const k = event.key.toLowerCase();

    if (modifiers[k as ModifierKey]) {
      pressedModifiers.add(modifiers[k as ModifierKey]);
    } else if (keys[k as KeyKey]) {
      pressedKeys.add(keys[k as KeyKey]);
    }

    const candidates = listeners.filter((l) => {
      for (const key of l.keys) {
        if (key == "any") return true;

        let [k, ...mods] = key.split("_").reverse() as [KeyValue, ...ModifierValue[]];

        if (!Array.from(pressedKeys).includes(k)) {
          continue;
        }

        if (Array.from(pressedModifiers).length !== mods.length || !Array.from(pressedModifiers).every((modifier) => mods.includes(modifier))) {
          continue;
        }

        return true;
      }

      return false;
    });

    if (candidates.length === 0) return;

    candidates.forEach((listener) => {
      const activeElement = document.activeElement;

      if (listener.config?.ignoreIfEditable && activeElement && activeElement instanceof Element && isEditableElement(activeElement)) return;

      if (listener.config?.runIfFocused) {
        const run = listener.config?.runIfFocused;

        if (Array.isArray(run)) {
          if (run.length == 0) return;

          if (!run.some(element => {
            return element && document.activeElement && element == document.activeElement;
          })) return;
        }
      };

      if (listener.config?.prevent) event.preventDefault();
      if (listener.config?.stop === true) event.stopPropagation();
      if (listener.config?.stop === "immediate") event.stopImmediatePropagation();
      if (listener.config?.stop === "both") { event.stopPropagation(); event.stopImmediatePropagation(); }

      listener.handler(event);
      log(`handled '${listener.id}'`);

      if (listener.config?.once) unlisten(listener.id);
    });
  };

  const onKeyup = (event: KeyboardEvent): void => {
    if (event.isComposing) return;

    const k = event.key.toLowerCase();

    if (modifiers[k as ModifierKey]) {
      pressedModifiers.delete(modifiers[k as ModifierKey]);
    } else if (keys[k as KeyKey]) {
      pressedKeys.delete(keys[k as KeyKey]);
    }

    log(`released '${k}'`);
  };

  const onBlur = () => {
    pressedKeys.clear();
    pressedModifiers.clear();
    log("cleared due to blur");
  };

  const clear = (): void => {
    for (const l of listeners) l.off?.();
    listeners = [];
    pressedKeys.clear();
    pressedModifiers.clear();
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
    const index = listeners.findIndex(l => l.id === id);
    if (index !== -1 && listeners[index]) {
      listeners[index].off();
      listeners.splice(index, 1);
      log(`removed: '${id}'`);
    }
  };

  const listen = (options: Options) => {
    if (options.config && "runIfFocused" in options.config && options.config.runIfFocused === undefined) {
      log("'runIfFocused' is explicitly set to 'undefined'. Was that intentional?");
    }

    const config: Config = {
      prevent: false,
      stop: false,
      ignoreIfEditable: false,
      once: false,
      ...options.config,
    };

    if (options.keys.includes("any")) {
      options.keys = ["any"];
    }

    if (options?.config?.signal?.aborted) return () => { };

    const id = Math.random().toString(36).slice(2, 7);

    const onAbort = () => unlisten(id);
    if (options?.config?.signal) options.config.signal.addEventListener("abort", onAbort, { once: true });

    listeners.push({
      id,
      off: () => config.signal?.removeEventListener("abort", onAbort),

      keys: options.keys,
      handler: options.run,
      config: options.config
    });

    log(`added '${options.keys.join(", ")}' with id: '${id}'`);

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

export { type Config, type KeyString, type Options };
