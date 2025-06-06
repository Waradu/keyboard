## How to use it

```bash
bun install @waradu/keyboard
```

```ts
import { useKeyboard, Key } from "@waradu/keyboard";

// Create keyboard.
const keyboard = useKeyboard();

// Listen for "A".
keyboard.listen([Key.A], (e) => {
  console.log("A key pressed");
});

// Listen for "B" and call prevent default.
keyboard.listen(
  [Key.B],
  (e) => {
    console.log("B key pressed");
  },
  { prevent: true },
);

// Listen for "C" unless an editable element like input is focused.
keyboard.listen(
  [Key.C],
  (e) => {
    console.log("C key pressed");
  },
  { ignoreIfEditable: true },
);

// Listen for "D" but only 1 time.
keyboard.listen(
  [Key.D],
  (e) => {
    console.log("D key pressed");
  },
  { once: true },
);

// Listen for "E".
const unlisten = keyboard.listen([Key.E], (e) => {
  console.log("D key pressed");
});

// Stop listening for "E" again.
unlisten();

keyboard.listen([Key.All], (e) => {
  console.log("Anything pressed");
});

// Listen for "F" only if the "runIfFocused" element is focused.
keyboard.listen(
  [Key.F],
  (e) => {
    console.log("F key pressed");
  },
  { runIfFocused: document.getElementById("test") },
);
// IMPORTANT: if you define runIfFocused as undefined the listener will not work.
// example configs: 
// - { ... } -> listener will run, 
// - { ..., runIfFocused: element } -> listener will run if element focused
// - { ..., runIfFocused: undefined } -> listener will not run!!!

keyboard.init();
```

You can find the complete list of available keys in the `src/keys.ts` file.
