## How to use it

```ts
import { useKeyboard, Key } from "wrdu-keyboard";

// Create keyboard
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
const unlisten = keyboard.listen(
  [Key.Alt, Key.L],
  (e) => {
    console.log("D key pressed");
  },
  { once: true },
);

// Stop listening for "D" again.
unlisten();

// Listen for every key.
keyboard.listen([Key.All], (e) => {
  console.log("Anything pressed");
});

// Call this when "window" is available.
keyboard.init();
```

You can find the complete list of available keys in the `src/keys.ts` file.
