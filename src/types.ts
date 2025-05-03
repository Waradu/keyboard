export type Handler = (event: KeyboardEvent) => void;

export interface Config {
  /**
   * Prevent Default.
   */
  prevent?: boolean;
  /**
   * Ignore listener if the user currently is in a editable element like input or textarea.
   */
  ignoreIfEditable?: boolean;
  /**
   * Only run listener if the `runIfFocused` element is focused.
   * 
   * **IMPORTANT**: if you define runIfFocused as undefined the listener will not work.
   * @example
   * ```ts
   * { ... } // listener will run,
   * { ..., runIfFocused: element } // listener will run if element is focused
   * { ..., runIfFocused: undefined } // listener will not run!!!
   * ```
   */
  runIfFocused?: HTMLElement | null;
  /**
   * Only listen once and then remove the listener.
   */
  once?: boolean;
}

export interface KeyboardConfig {
  /**
   * Print debug messages.
   */
  debug?: boolean;
}

export type Handlers = Record<string, (Config & { handler: Handler; id: string })[]>;
