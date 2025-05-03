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
