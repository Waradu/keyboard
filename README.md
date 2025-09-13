## Keyboard Manager

[![testing](https://github.com/Waradu/keyboard/actions/workflows/testing.yml/badge.svg)](https://github.com/Waradu/keyboard/actions/workflows/testing.yml)

- [Install](#install)
- [Get Started](#get-started)
- [Nuxt](#nuxt)
- [Usage](#usage)
- [Key Sequence](#key-sequence)
- [Handler](#handler)
- [Config](#config)
- [v6 Changes](#v6-changes)
- [Development](#development)

### Install

```bash
bun install @waradu/keyboard
```

### Get Started

Start by importing `useKeyboard` and create a new keyboard instance.

```ts
import { useKeyboard } from "@waradu/keyboard";

const keyboard = useKeyboard();
```

### Nuxt

Nuxt users can use the built-in module that automatically creates and initializes a keyboard instance. It also cleans up listeners when the component unmounts.

First add the package to the modules in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["@waradu/keyboard/nuxt"],
});
```

And then use it like this:

```ts
useKeybind({
  keys: ["a"],
  run() {
    console.log("A key pressed");
  },
});
```

If you need to access the useKeyboard instance use the nuxt plugin.

```ts
const { $keyboard } = useNuxtApp();

$keyboard.destroy();
```

### Usage

Do not forget to call `keyboard.init();` once window is available.

A listener can be really simple. You just need one or more [key sequences](#key-sequence), a [handler](#handler) and the [config](#config) (optional).

```ts
const unlisten = keyboard.listen({
  keys: ["control_y", "control_shift_z"], // key sequences
  run() {
    // handler
    console.log("redo");
  },
  config: {
    // config
  },
});
```

`keyboard.listen` returns a unlisten function that can be called to remove the listener.

```ts
const unlisten = keyboard.listen(...);
unlisten();
```

It is also possible to define multiple keybinds in one `listen` call.

```ts
keyboard.listen([
  {
    keys: ["control_z"],
    run() {
      console.log("undo");
    },
  },
  {
    keys: ["control_y", "control_shift_z"],
    run() {
      console.log("redo");
    },
  },
]);
```

### Key Sequence

Key sequences are just strings of characters defining the key that needs to be pressed to activate the listener. A listener can have multiple key sequences.

The structure looks like this (`?` = optional, `!` = required):
`"(meta_)?(control_)?(alt_)?(shift_)?(key)!"` or `"any"`

Meta is the equivalent of `windows key` on windows or `cmd` on macos.
The order is fixed, the `key` will always come last, `control` always after `meta` etc. The modifiers are not required.

Some example to get a better understanding:

- `"control_x"`: ✅
- `"meta_control_alt_shift_arrow-up"`: ✅
- `"c"`: ✅
- `"any"`: ✅ (catch all)
- `""`: ❌ (empty string)
- `"shift_alt_y"`: ❌ (`shift` comes after `alt`)
- `"meta_control"`: ❌ (`key` is required)
- `"xy"`: ❌ (only one `key` at a time)

Why move from the old way (`[Key.Control, Key.X]`)?

1. It does not require the import of a seperate property.
2. A valid key sequence is enforced (`[Key.X, Key.X]` was valid).
3. The order is fixed so it is more consistent.
4. Easier to read.

### Handler

The handler is a function that runs when the key sequence is pressed.

```ts
keyboard.listen({
  ...
  run(event) {
    console.log("test");
  },
  // or with an arrow function:
  run: (event) => {
    console.log("test");
  },
  ...
});
```

### Config

You can configure and change the behavior of the listener. All keys are optional.

```ts
const emailInput = document.getElementById("passwordInput"); // Normal
const passwordInput = useTemplateRef("passwordInput"); // Nuxt

keyboard.listen({
  ...
  config: {
    // Remove the listener after one run.
    once: true,

    // Ignore the listener if any text element like input is focused.
    ignoreIfEditable: true,

    // A list of elements which one has to be focused for the listener to run.
    runIfFocused: [emailInput, passwordInput],

    // Call preventDefault() before run.
    prevent: true,

    // Call stopPropagation() before run. (use "immediate" for stopImmediatePropagation() and "both" for both).
    stop: true,
  }
});
```

Also you can pass a `signal` to the config or the useKeyboard to abort them with a `signal`.

### v6 Changes

- Use `e.key` instead of `e.code`
- Multiple Keybinds per listener
- Remove the need to use `Key.*`
- Rewrite `runIfFocused` to `elements` to allow multiple targets
- Ignore `event.isComposing` and Dead keys
- Remove `ignoreCase`
- Restructure

### Development

Use [bun](https://bun.sh).

1. `bun install`
2. `cd playground`
3. `bun install`
4. 👍
