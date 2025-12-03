import type { Directive } from 'vue';
import type { Options } from "@waradu/keyboard";
import { useKeybind } from "./composables";

const KEY = Symbol("keybind-run");

type SharedState = {
  run?: Options["run"];
  keys?: Options["keys"];
  modifiers?: {
    prevent?: boolean;
    once?: boolean;
  };
  registered?: boolean;
};

function tryRegister(el: HTMLElement, shared: SharedState) {
  if (!shared.run || !shared.keys || shared.registered || !el) return;

  useKeybind({
    keys: shared.keys,
    run: shared.run,
    config: {
      prevent: shared.modifiers?.prevent,
      once: shared.modifiers?.once,
      runIfFocused: [el],
    },
  });

  shared.registered = true;
}

export const vKeybind: Directive<HTMLElement, Options["keys"], "prevent" | "once"> = {
  mounted(el, binding) {
    const shared: SharedState = (el as any)[KEY] ?? ((el as any)[KEY] = {});

    shared.modifiers = { ...binding.modifiers };
    shared.keys = binding.value;

    tryRegister(el, shared);
  },
};


export const vRun: Directive<HTMLElement, Options["run"]> = {
  mounted(el, binding) {
    const shared: SharedState = (el as any)[KEY] ?? ((el as any)[KEY] = {});

    shared.run = binding.value;

    tryRegister(el, shared);
  },
};