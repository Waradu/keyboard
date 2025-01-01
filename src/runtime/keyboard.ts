import { Key } from '../types/keys'
import { defineNuxtPlugin, type Plugin } from '#app'

type KeyHandler = (event: KeyboardEvent) => void

interface Handlers {
  down: {
    [key: string]: KeyHandler[]
  }
  up: {
    [key: string]: KeyHandler[]
  }
}

const getKeyString = (keys: Key[]) => keys.sort().join('+')

const handlers: Handlers = {
  down: {},
  up: {},
}

const pressedKeys = new Set<Key>()

const onKeydown = (event: KeyboardEvent) => {
  pressedKeys.add(event.code as Key)

  const pressedArray = Array.from(pressedKeys) as Key[]
  const keyString = getKeyString(pressedArray)

  if (handlers.down[keyString]) {
    handlers.down[keyString].forEach(handler => handler(event))
  }

  // Handle global handlers (if any)
  if (handlers.down[Key.All]) {
    handlers.down[Key.All].forEach(handler => handler(event))
  }
}

const onKeyup = (event: KeyboardEvent) => {
  pressedKeys.delete(event.code as Key)

  const releasedArray = Array.from(pressedKeys) as Key[]
  const keyString = getKeyString(releasedArray)

  if (handlers.up[keyString]) {
    handlers.up[keyString].forEach(handler => handler(event))
  }

  // Handle global handlers (if any)
  if (handlers.up[Key.All]) {
    handlers.up[Key.All].forEach(handler => handler(event))
  }
}

const init = () => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keyup', onKeyup)
}

const stop = () => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('keyup', onKeyup)
}

const down = (keys: Key[], handler: KeyHandler) => {
  const key = getKeyString(keys)
  if (!handlers.down[key]) {
    handlers.down[key] = []
  }
  handlers.down[key].push(handler)
}

const up = (keys: Key[], handler: KeyHandler) => {
  const key = getKeyString(keys)
  if (!handlers.up[key]) {
    handlers.up[key] = []
  }
  handlers.up[key].push(handler)
}

export interface Keyboard {
  init: () => void
  stop: () => void
  down: (keys: Key[], handler: KeyHandler) => void
  up: (keys: Key[], handler: KeyHandler) => void
}

const keyboard: Plugin<{ keyboard: Keyboard }> = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    init()
  })

  return {
    provide: {
      keyboard: {
        init,
        stop,
        down,
        up,
      },
    },
  }
})

export default keyboard
