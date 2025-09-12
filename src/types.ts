import type { KeyString } from "./keys";

export type Handler = (event: KeyboardEvent) => void;

export interface Config {
  /**
   * Prevent default.
   * @default false
   */
  prevent?: boolean;
  /**
   * Stop propagation.
   * Note: this won't prevent other keyboard listeners on the same instance. You have to handle this youself.
   *
   * Possible values:
   * - `true`:  
   *   Calls `event.stopPropagation()`, preventing the event from reaching parent targets but allowing any remaining listeners on this same element to run.
   * - `"immediate"`:  
   *   Calls `event.stopImmediatePropagation()`, preventing any further listeners on this same element from running, but still allowing the event to bubble to parent targets.
   * - `"both"`:  
   *   Stop *immediate* propagation (no further listeners on this same target)  
   *   **and** prevent any propagation to parent targets.
   *
   * @default false
   */
  stop?: "immediate" | "both" | boolean;
  /**
   * Ignore listener if the user currently is in a editable element like input or textarea.
   * @default false
   */
  ignoreIfEditable?: boolean;
  /**
   * Only run listener if one of the `runIfFocused` elements is focused.
   *
   * **IMPORTANT**: if runIfFocused is null the listener will not run.
   * @example
   * ```ts
   * { ... } // listener will run,
   * { ..., runIfFocused: [element, element] } // listener will run if one of the elements is focused
   * { ..., runIfFocused: null } // listener will not run!
   * ```
   */
  runIfFocused?: (HTMLElement | null)[];
  /**
   * Only listen once and then remove the listener.
   * @default false
   */
  once?: boolean;

  signal?: AbortSignal;
}

export interface KeyboardConfig {
  /**
   * Print debug messages.
   * @default false
   */
  debug?: boolean;

  signal?: AbortSignal;
}

export type Listener = {
  id: string;
  off: () => void;

  keys: KeyString[];
  handler: Handler;
  config?: Config;
};
export type Handlers = Listener[];

export interface Options {
  keys: KeyString[];
  run: Handler;
  config?: Config;
}