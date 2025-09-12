<template>
  <div>Nuxt module playground!</div>
</template>

<script setup lang="ts">
useKeybind({
  keys: ["alt_a"],
  run() {
    console.log("RUN");
  },
});
</script>
