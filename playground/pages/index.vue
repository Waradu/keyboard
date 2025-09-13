<template>
  <div>INDEX</div>
  <NuxtLink to="/test">test</NuxtLink>
  <br />
  <input type="text" ref="textInput" />
</template>

<script setup lang="ts">
useKeybind([
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

const textInput = useTemplateRef("textInput");

onMounted(() => {
  useKeybind({
    keys: ["enter"],
    run() {
      console.log("Enter pressed while input is focused");
    },
    config: {
      runIfFocused: [textInput.value],
    },
  });
});
</script>
