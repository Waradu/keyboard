<template>
  <NuxtPage />
  <footer>
    <span>Active listeners:</span>
    <ClientOnly>
      <div v-for="listener in listeners" style="display: flex; align-items: center; gap: 12px">
        <pre>{{ listener.id }}:</pre>
        {{ listener.keys.join(", ") }} {{ listener.config.once ? "(once)" : "" }}
      </div>
    </ClientOnly>
  </footer>
</template>

<script lang="ts" setup>
const { listeners } = useKeyboardInspector();
</script>

<style>
html {
  font-family: sans-serif;
}

footer {
  margin-top: 40px;
}
</style>
