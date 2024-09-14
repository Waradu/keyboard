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

const handlers: Handlers = {
  down: {},
  up: {},
}

const onKeydown = (event: KeyboardEvent) => {
  const keyHandlers = handlers.down[event.key]
  if (keyHandlers) {
    keyHandlers.forEach(handler => handler(event))
  }

  const allKeyHandlers = handlers.down['all']
  if (allKeyHandlers) {
    allKeyHandlers.forEach(handler => handler(event))
  }
}

const onKeyup = (event: KeyboardEvent) => {
  const keyHandlers = handlers.up[event.key]
  if (keyHandlers) {
    keyHandlers.forEach(handler => handler(event))
  }

  const allKeyHandlers = handlers.up['all']
  if (allKeyHandlers) {
    allKeyHandlers.forEach(handler => handler(event))
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

const down = (key: string, handler: KeyHandler) => {
  if (!handlers.down[key]) {
    handlers.down[key] = []
  }
  handlers.down[key].push(handler)
}

const up = (key: string, handler: KeyHandler) => {
  if (!handlers.up[key]) {
    handlers.up[key] = []
  }
  handlers.up[key].push(handler)
}

export interface Keyboard {
  init: () => void
  stop: () => void
  down: (key: string, handler: KeyHandler) => void
  up: (key: string, handler: KeyHandler) => void
}

const keyboard: Plugin<{ keyboard: Keyboard }> = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    stop()
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
