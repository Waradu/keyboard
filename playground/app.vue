<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">
const keyboard = useKeyboard()

keyboard.down('all', (e) => {
  console.log(e)
})
</script>
