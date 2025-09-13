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

useKeybind([
  {
    keys: ["no-macos:control_z", "macos:meta_z"],
    run() {
      console.log("undo");
    },
  },
  {
    keys: ["no-macos:control_shift_z", "macos:meta_shift_z"],
    run() {
      console.log("redo");
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
