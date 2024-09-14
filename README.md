# Keyboard

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

## Features

<!-- Highlight some of the features your module provide here -->
Manage keybinds for your nuxt app

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
const keyboard = useKeyboard()

keyboard.down('a', (event) => {
  // do something
})
```

if you want to check for all keys use "all"

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
