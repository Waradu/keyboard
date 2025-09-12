export const keys = {
  // Control / system (without modifiers)
  backspace: "backspace",
  tab: "tab",
  enter: "enter",
  pause: "pause",
  escape: "escape",
  " ": "space",
  pageup: "page-up",
  pagedown: "page-down",
  end: "end",
  home: "home",
  arrowleft: "arrow-left",
  arrowup: "arrow-up",
  arrowright: "arrow-right",
  arrowdown: "arrow-down",
  printscreen: "print-screen",
  insert: "insert",
  delete: "delete",
  contextmenu: "context-menu",

  // Numbers
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",

  // Letters
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  h: "h",
  i: "i",
  j: "j",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "o",
  p: "p",
  q: "q",
  r: "r",
  s: "s",
  t: "t",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",

  // Function keys
  f1: "f1",
  f2: "f2",
  f3: "f3",
  f4: "f4",
  f5: "f5",
  f6: "f6",
  f7: "f7",
  f8: "f8",
  f9: "f9",
  f10: "f10",
  f11: "f11",
  f12: "f12",

  // Lock keys
  numlock: "num-lock",
  scrolllock: "scroll-lock",

  // Media / audio
  audiovolumemute: "audio-volume-mute",
  audiovolumedown: "audio-volume-down",
  audiovolumeup: "audio-volume-up",
  mediatracknext: "media-track-next",
  mediatrackprevious: "media-track-previous",
  mediaplaypause: "media-play-pause",
  mediaplay: "media-play",
  mediapause: "media-pause",
  mediastop: "media-stop",

  // Symbols / punctuation (from event.key)
  "-": "minus",
  "=": "equal",
  "+": "plus",
  ",": "comma",
  ".": "period",
  "/": "slash",
  "`": "backquote",
  "~": "tilde",
} as const;

export const modifiers = {
  meta: "meta",
  control: "control",
  alt: "alt",
  shift: "shift",
} as const;

export type ModifierKey = keyof typeof modifiers;
export type KeyKey = keyof typeof keys;

export type ModifierValue = (typeof modifiers)[keyof typeof modifiers];
export type KeyValue = (typeof keys)[keyof typeof keys];

type NonEmptyPermutations<T, U = T> = [T] extends [never]
  ? never
  : T extends U
  ? [T] | [T, ...NonEmptyPermutations<Exclude<U, T>>]
  : never;

type Join<T extends readonly string[], Sep extends string> = T extends []
  ? ""
  : T extends [infer F extends string]
  ? F
  : T extends [infer F extends string, ...infer R extends readonly string[]]
  ? `${F}${Sep}${Join<R, Sep>}`
  : string;

type PrefixTuples = NonEmptyPermutations<ModifierValue>;
type WithPrefix = `${Join<PrefixTuples, "_">}_${KeyValue}`;

export type KeyString = KeyValue | WithPrefix | "any";
