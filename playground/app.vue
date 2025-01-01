<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">
import { Key } from '../src/runtime/types/keys'

const keyboard = useKeyboard()

keyboard.down([Key.LeftShift, Key.A], (event) => {
  console.log(event)
})
</script>
