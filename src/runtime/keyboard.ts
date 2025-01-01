import { Key } from './types/keys'
import { defineNuxtPlugin, type Plugin } from '#app'

type Handler = (event: KeyboardEvent) => void

type KeyHandler = {
  prevent: boolean
  handler: Handler
}

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
    handlers.down[keyString].forEach((handler) => {
      if (handler.prevent) {
        event.preventDefault()
      }
      handler.handler(event)
    })
  }

  if (handlers.down[Key.All]) {
    handlers.down[Key.All].forEach((handler) => {
      if (handler.prevent) {
        event.preventDefault()
      }
      handler.handler(event)
    })
  }
}

const onKeyup = (event: KeyboardEvent) => {
  pressedKeys.delete(event.code as Key)

  const releasedArray = Array.from(pressedKeys) as Key[]
  const keyString = getKeyString(releasedArray)

  if (handlers.up[keyString]) {
    handlers.up[keyString].forEach(handler => handler.handler(event))
  }

  if (handlers.up[Key.All]) {
    handlers.up[Key.All].forEach(handler => handler.handler(event))
  }
}

const init = () => {
  stop()
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keyup', onKeyup)
}

const stop = () => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('keyup', onKeyup)
}

const down = (keys: Key[], handler: Handler, prevent: boolean) => {
  const key = getKeyString(keys)
  if (!handlers.down[key]) {
    handlers.down[key] = []
  }
  handlers.down[key].push({ handler, prevent })
}

const up = (keys: Key[], handler: Handler, prevent: boolean) => {
  const key = getKeyString(keys)
  if (!handlers.up[key]) {
    handlers.up[key] = []
  }
  handlers.up[key].push({ handler, prevent })
}

export interface Keyboard {
  init: () => void
  stop: () => void
  down: (keys: Key[], handler: Handler) => void
  up: (keys: Key[], handler: Handler) => void
  prevent: {
    down: (keys: Key[], handler: Handler) => void
    up: (keys: Key[], handler: Handler) => void
  }
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
        down: (keys: Key[], handler: Handler) => down(keys, handler, false),
        up: (keys: Key[], handler: Handler) => up(keys, handler, false),
        prevent: {
          down: (keys: Key[], handler: Handler) => down(keys, handler, true),
          up: (keys: Key[], handler: Handler) => up(keys, handler, true),
        },
      },
    },
  }
})

export default keyboard
