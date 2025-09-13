<template>
  <div>TEST</div>
  <NuxtLink to="/">index</NuxtLink>
</template>

<script setup lang="ts">
useKeybind([
  {
    keys: ["a"],
    run() {
      console.log("RUN BA");
    },
  },
  {
    keys: ["control_b"],
    run() {
      console.log("RUN BB");
    },
  },
]);

useKeybind({
  keys: ["control_r", "meta_r"],
  run() {
    console.log("Refresh prevented!");
  },
  config: {
    prevent: true,
  },
});

useKeybind({
  keys: ["escape"],
  run() {
    console.log("Escape pressed, this will only log once.");
  },
  config: {
    once: true,
  },
});
</script>
