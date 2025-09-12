<template>
  <div>Nuxt module playground!</div>
</template>

<script setup lang="ts">
useKeybind({
  keys: ["meta_control_shift_a"],
  run() {
    console.log("RUN");
  },
});
</script>
