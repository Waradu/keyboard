import { Key } from './types/keys'
import { defineNuxtPlugin, type Plugin } from '#app'

type Handler = (event: KeyboardEvent) => void

type KeyHandler = {
  prevent: boolean
  handler: Handler
  once: boolean
}

interface Handlers {
  down: {
    [key: string]: KeyHandler[]
  }
  up: {
    [key: string]: KeyHandler[]
  }
}

const getKeyString = (keys: Key[]) =>
  keys.includes(Key.All) ? 'All' : keys.sort().join('+')

const handlers: Handlers = {
  down: {},
  up: {},
}

const pressedKeys = new Set<Key>()

const onKeydown = (event: KeyboardEvent) => {
  const key = event.code as Key
  pressedKeys.add(key)

  const pressedArray = Array.from(pressedKeys) as Key[]

  for (const keyString of [getKeyString(pressedArray), 'All']) {
    if (handlers.down[keyString]) {
      handlers.down[keyString].forEach((eventHandler) => {
        if (eventHandler.prevent) {
          event.preventDefault()
        }
        eventHandler.handler(event)
        if (eventHandler.once) {
          handlers.down[keyString] = handlers.down[keyString].filter(
            h => h !== eventHandler,
          )
        }
      })
    }
  }
}

const onKeyup = (event: KeyboardEvent) => {
  const key = event.code as Key
  pressedKeys.delete(key)

  const releasedArray = Array.from(pressedKeys) as Key[]

  for (const keyString of [getKeyString(releasedArray), 'All']) {
    if (handlers.up[keyString]) {
      handlers.up[keyString].forEach((eventHandler) => {
        if (eventHandler.prevent) {
          event.preventDefault()
        }
        eventHandler.handler(event)
        if (eventHandler.once) {
          handlers.up[keyString] = handlers.up[keyString].filter(
            h => h !== eventHandler,
          )
        }
      })
    }
  }
}

const init = () => {
  stop()
  pressedKeys.clear()
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keyup', onKeyup)
}

const stop = () => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('keyup', onKeyup)
}

const unregisterAll = () => {
  handlers.down = {}
  handlers.up = {}
}

type Config = {
  once?: boolean
  prevent?: boolean
}

const down = (keys: Key[], handler: Handler, config: Config = {}) => {
  if (keys.includes(Key.All)) {
    keys = [Key.All]
  }

  if (keys.length === 0) {
    throw new Error('At least one key must be provided')
  }

  const key = getKeyString(keys)
  if (!handlers.down[key]) {
    handlers.down[key] = []
  }

  const { once = false, prevent = false } = config

  handlers.down[key].push({ handler, prevent, once })
}

const up = (keys: Key[], handler: Handler, config: Config = {}) => {
  if (keys.includes(Key.All)) {
    keys = [Key.All]
  }

  if (keys.length === 0) {
    throw new Error('At least one key must be provided')
  }

  const key = getKeyString(keys)
  if (!handlers.up[key]) {
    handlers.up[key] = []
  }

  const { once = false, prevent = false } = config

  handlers.up[key].push({ handler, prevent, once })
}

type PublicConfig = Omit<Config, 'prevent'>

type New = (keys: Key[], handler: Handler, config?: PublicConfig) => void

export interface Keyboard {
  init: () => void
  stop: () => void
  unregisterAll: () => void
  down: New
  up: New
  prevent: {
    down: New
    up: New
  }
}

type KeyboardPlugin = Plugin<{ keyboard: Keyboard }>

const keyboard: KeyboardPlugin = defineNuxtPlugin((nuxtApp: { hook: (name: string, cb: () => void) => void }) => {
  nuxtApp.hook('app:mounted', () => {
    init()
  })

  return {
    provide: {
      keyboard: {
        init,
        stop,
        unregisterAll,
        down: (keys: Key[], handler: Handler, config: PublicConfig = {}) =>
          down(keys, handler, config),
        up: (keys: Key[], handler: Handler, config: PublicConfig = {}) =>
          up(keys, handler, config),
        prevent: {
          down: (keys: Key[], handler: Handler, config: PublicConfig = {}) =>
            down(keys, handler, { ...config, prevent: true }),
          up: (keys: Key[], handler: Handler, config: PublicConfig = {}) =>
            up(keys, handler, { ...config, prevent: true }),
        },
      },
    },
  }
})

export default keyboard
