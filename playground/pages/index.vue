<template>
  <div>INDEX</div>
  <NuxtLink to="/test">test</NuxtLink>
</template>

<script setup lang="ts">
const off = useKeybind([
  {
    keys: ["a"],
    run() {
      console.log("RUN AA");
    },
  },
  {
    keys: ["control_b"],
    run() {
      console.log("RUN AB");
    },
  },
]);
</script>
