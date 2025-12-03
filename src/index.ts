import { detectOsInBrowser, isEditableElement } from "./helper";
import {
  keys,
  modifiers,
  type KeyKey,
  type KeySequence,
  type KeyString,
  type KeyValue,
  type ModifierKey,
  type ModifierValue,
  type PlatformValue,
} from "./keys";
import type { Config, Handlers, KeyboardConfig, Handler, HandlerContext, Options, Os, Listener, SubscribeCallback } from "./types";

/**
 * Create a keyboard listener.
 *
 * @param config Optional settings to configure the keyboard.
 */
export const useKeyboard = (config: KeyboardConfig = { debug: false }) => {
  const instanceSignal = config.signal;
  let listeners: Handlers = [];
  let detectedPlatform: Os | null = config.platform ?? null;

  const pressedKeys = new Set<KeyValue>();
  const pressedModifiers = new Set<ModifierValue>();

  const log = (...text: string[]) => {
    if (config.debug) console.log(`<KEYBOARD>`, ...text);
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.isComposing) return;

    const k = event.key.toLowerCase();

    log(`pressed '${k}'`);

    if (modifiers[k as ModifierKey]) {
      pressedModifiers.add(modifiers[k as ModifierKey]);
      return;
    } else if (keys[k as KeyKey]) {
      pressedKeys.add(keys[k as KeyKey]);
    }

    const candidates = listeners.filter((l) => {
      for (let key of l.keys) {
        if (key == "any") return true;

        let platform: PlatformValue | undefined;

        if (key.includes(":")) {
          [platform, key] = key.split(":") as [PlatformValue, KeySequence];
        }

        if (platform) {
          if (platform === "linux" && detectedPlatform !== "linux") continue;
          if (platform === "win" && detectedPlatform !== "windows") continue;
          if (platform === "macos" && detectedPlatform !== "macos") continue;
          if (platform === "no-linux" && detectedPlatform === "linux") continue;
          if (platform === "no-win" && detectedPlatform === "windows") continue;
          if (platform === "no-macos" && detectedPlatform === "macos") continue;
        }

        let [k, ...mods] = key.split("_").reverse() as [KeyValue, ...ModifierValue[]];

        const pressedKeysArray = Array.from(pressedKeys);
        const firstKey = pressedKeysArray[pressedKeysArray.length - 1];
        if (k === "$num" && Number.isNaN(parseInt(firstKey!))) {
          continue;
        } else if (k !== "$num" && !Array.from(pressedKeys).includes(k)) {
          continue;
        }

        if (
          Array.from(pressedModifiers).length !== mods.length ||
          !Array.from(pressedModifiers).every((modifier) => mods.includes(modifier))
        ) {
          continue;
        }

        return true;
      }

      return false;
    });

    if (candidates.length === 0) return;

    candidates.forEach((listener) => {
      const activeElement = document.activeElement;

      if (
        listener.config?.ignoreIfEditable &&
        activeElement &&
        activeElement instanceof Element &&
        isEditableElement(activeElement)
      )
        return;

      if (listener.config?.runIfFocused) {
        const run = listener.config?.runIfFocused;

        if (Array.isArray(run)) {
          if (
            !run.some((element) => {
              return element && document.activeElement && element == document.activeElement;
            })
          )
            return;
        }
      }

      if (listener.config?.prevent) event.preventDefault();
      if (listener.config?.stop === true) event.stopPropagation();
      if (listener.config?.stop === "immediate") event.stopImmediatePropagation();
      if (listener.config?.stop === "both") {
        event.stopPropagation();
        event.stopImmediatePropagation();
      }

      const pressedKeysArray = Array.from(pressedKeys);
      const pressedNumber = parseInt(pressedKeysArray[pressedKeysArray.length - 1]!);

      listener.handler({
        template: Number.isNaN(pressedNumber) ? undefined : pressedNumber,
        listener: listener,
        event: event,
      });
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

    notify();
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

  const init = async (opts?: { signal?: AbortSignal; }) => {
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

      if (!detectedPlatform)
        detectOsInBrowser().then((res) => {
          if (["macos", "linux", "windows"].includes(res)) detectedPlatform = res;
          log("platform detected as:", res);
        });

      log("initialized");
    } else {
      log("ERROR: window was not found");
    }
  };

  const unlisten = (id: string) => {
    const index = listeners.findIndex((l) => l.id === id);
    if (index !== -1 && listeners[index]) {
      listeners[index].off();
      listeners.splice(index, 1);
      log(`removed: '${id}'`);
    }

    notify();
  };

  const listen = (options: Options | Options[]) => {
    if (!Array.isArray(options)) {
      options = [options];
    }

    const results = options
      .map((option) => {
        if (
          option.config &&
          "runIfFocused" in option.config &&
          option.config.runIfFocused === undefined
        ) {
          log("'runIfFocused' is explicitly set to 'undefined'. Was that intentional?");
        }

        const config: Config = {
          prevent: false,
          stop: false,
          ignoreIfEditable: false,
          once: false,
          ...option.config,
        };

        if (option.keys.includes("any")) {
          option.keys = ["any"];
        }

        if (option?.config?.signal?.aborted) return;

        const id = Math.random().toString(36).slice(2, 7);

        const onAbort = () => unlisten(id);
        if (option?.config?.signal)
          option.config.signal.addEventListener("abort", onAbort, { once: true });

        if (!Array.isArray(option.keys)) {
          option.keys = [option.keys];
        }

        const listener: Listener = {
          id,
          off: () => config.signal?.removeEventListener("abort", onAbort),

          keys: option.keys,
          handler: option.run,
          config: config,
        };

        listeners.push(listener);

        notify();

        log(`added '${option.keys.join(", ")}' with id: '${id}'`);

        return { id, onAbort };
      })
      .filter((result) => !!result);

    return () => {
      results.forEach((result) => {
        if (config.signal) config.signal.removeEventListener("abort", result.onAbort);
        unlisten(result.id);
      });
    };
  };

  let subscribers: SubscribeCallback[] = [];

  const notify = () => {
    subscribers.forEach((cb) => cb([...listeners]));
  };

  const subscribe = (cb: SubscribeCallback) => {
    subscribers.push(cb);
    cb([...listeners]);
    return () => {
      subscribers = subscribers.filter((fn) => fn !== cb);
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
    /**
    * Subscribe to changes of all registered keyboard listeners.
    *
    * The callback is called:
    * - once immediately with the current listeners
    * - on every add/remove/clear of listeners
    *
    * @param callback Receives the current list of listeners on each change.
    * @returns Function to unsubscribe from further updates.
    */
    subscribe,
  };
};

export type { Config, KeyString, Options, Handler, Handlers, HandlerContext, Listener };