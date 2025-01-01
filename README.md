# Keyboard

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

## Features

Manage keybinds for your Nuxt app

- keyboard.up
- keyboard.down

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add wrdu-keyboard
```

That's it! You can now use Keyboard in your Nuxt app ✨

## How to use it

Setup script:

```js
import { Key } from "wrdu-keyboard/key";

const keyboard = useKeyboard()

// Register a keydown handler for Shift + A
keyboard.down([Key.LeftShift, Key.A], (event) => {
  console.log('Shift + A pressed')
})

// Register a keyup handler for Ctrl + Alt + K
keyboard.up([Key.LeftControl, Key.LeftAlt, Key.K], (event) => {
  console.log('Ctrl + Alt + K released')
})

// Register a global keydown handler for all keys
keyboard.down([Key.All], (event) => {
  console.log('Any key pressed')
})

// Register a keyup handler that calls preventDefault automatic
keyboard.prevent.up([Key.LeftShift, Key.A], (event) => {
  console.log('Shift + A prevented')
})

// Register a keyup handler that only gets called once
keyboard.down([Key.LeftShift, Key.A], (event) => {
  console.log('Shift + A prevented')
}, { once: true })
```

The `down` and `up` methods allow you to register handlers for specific key combinations. You can pass an array of `Key` enum values to specify the desired combination.

The `Key` enum provides constants for commonly used keys, such as `Key.LeftShift`, `Key.A`, `Key.LeftControl`, etc. You can find the complete list of available keys in the `src/types/keys.ts` file.

To register a global handler that triggers for any key press or release, you can use `Key.All` as the only element in the array.

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/wrdu-keyboard/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/wrdu-keyboard

[npm-downloads-src]: https://img.shields.io/npm/dm/wrdu-keyboard.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/wrdu-keyboard

[license-src]: https://img.shields.io/npm/l/wrdu-keyboard.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/wrdu-keyboard

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
