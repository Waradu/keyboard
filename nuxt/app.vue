<template>
  <div>
    <div>{{ message }}</div>
    <input type="text">
  </div>
</template>

<script setup lang="ts">
import { keyboard, Key } from '../src/index';
const message = ref('');

keyboard.init();

keyboard.down([Key.A], () => {
  message.value = 'A key pressed';
});

keyboard.down([Key.AltLeft, Key.L], () => {
  message.value = 'Alt + L pressed';
});

keyboard.down([Key.AltRight, Key.L], () => {
  message.value = 'AltRight + L pressed';
});

keyboard.prevent.up([Key.LeftControl, Key.C], () => {
  message.value = 'Ctrl + C prevented';
});
</script>
