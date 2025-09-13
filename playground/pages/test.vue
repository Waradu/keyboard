<template>
  <div>TEST</div>
  <NuxtLink to="/">index</NuxtLink>
</template>

<script setup lang="ts">
const off = useKeybind([
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
</script>
