<template>
  <div>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { keyboard, Key } from '../src/index';
const message = ref('');

keyboard.init();

keyboard.down([Key.A], () => {
  message.value = 'A key pressed';
});

keyboard.down([Key.LeftShift, Key.B], () => {
  message.value = 'Shift + B pressed';
});

keyboard.prevent.up([Key.LeftControl, Key.C], () => {
  message.value = 'Ctrl + C prevented';
});
</script>
