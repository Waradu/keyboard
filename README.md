## How to use it

```bash
bun install @waradu/keyboard
```

Do not forget to call `keyboard.init();` once window is available.

```ts
import { useKeyboard } from "@waradu/keyboard";

// Create keyboard.
const keyboard = useKeyboard();

// Listen for "A".
keyboard.listen({
  keys: ["a"],
  run() {
    console.log("A key pressed");
  },
});

// Listen for "Meta" + "Control" + "A" (use typescript to get auto recommendations).
keyboard.listen({
  keys: ["meta_control_a"],
  run() {
    console.log("A key pressed");
  },
});
/*
The order does not matter except the actual key has to be last.
"a_control": No
"control_a_shift": No
"control_shift_a": Yes
"alt_shift_space": Yes
"meta_shift_1": Yes
*/

// Listen for "B" and call prevent default.
keyboard.listen({
  keys: ["b"],
  run() {
    console.log("B key pressed");
  },
  config: { prevent: true },
});

// Listen for "C" unless an editable element like input is focused.
keyboard.listen({
  keys: ["c"],
  run() {
    console.log("C key pressed");
  },
  config: { ignoreIfEditable: true },
});

// Listen for "D" but only 1 time.
keyboard.listen({
  keys: ["d"],
  run() {
    console.log("D key pressed");
  },
  config: { once: true },
});

// Listen for "E".
const unlisten = keyboard.listen({
  keys: ["E"],
  run() {
    console.log("E key pressed");
  },
});

// Stop listening for "E" again.
unlisten();

// Listen for any key press.
keyboard.listen({
  keys: ["any"],
  run() {
    console.log("Anything pressed");
  },
});

// Listen for "F" only if the "runIfFocused" element is focused.
keyboard.listen({
  keys: ["f"],
  run() {
    console.log("F key pressed");
  },
  config: { runIfFocused: document.getElementById("test") },
});

keyboard.init();
```

For nuxt user add the package to the modules in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["@waradu/keyboard/nuxt"], // this also auto inits the keyboard on mounted
});
```

and use it like this:

```ts
import { Key } from "@waradu/keyboard";

useKeybind({
  keys: ["a"],
  run() {
    console.log("A key pressed");
  },
});
```

If you need to access the useKeyboard model use:

```ts
const { $keyboard } = useNuxtApp();

$keyboard.destroy();
```

# v6 Changes:

- Use `e.key` instead of `e.code`
- Multiple Keybinds per listener
- Remove the need to use `Key.*`
- Rewrite `runIfFocused` to `elements` to allow multiple targets
- Ignore `event.isComposing` and Dead keys
- Remove `ignoreCase`
- Restructure
