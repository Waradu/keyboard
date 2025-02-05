<template>
  <div class="p-4">
    <h1>Keyboard Events Demo</h1>
    <div class="mt-4">
      <pre class="whitespace-pre-wrap">{{ logs }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { keyboard, Key } from '../src'
import { ref, onMounted, onUnmounted } from 'vue'

const logs = ref<string[]>([])

const log = (message: string) => {
  logs.value = [...logs.value, message]
}

onMounted(() => {
  keyboard.init()

  keyboard.down([Key.A], (e) => {
    log('A pressed')
  })

  keyboard.down([Key.LeftControl, Key.S], (e) => {
    log('Ctrl+S pressed')
  })

  keyboard.prevent.down([Key.LeftControl, Key.A], (e) => {
    log('Ctrl+A prevented')
  })
})

onUnmounted(() => {
  keyboard.stop()
})
</script>
