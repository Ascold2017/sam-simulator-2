<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useEnvironmentStore } from './stores/environment';
import { useMissionStore } from './stores/mission';
// Initialization
useMissionStore()
useEnvironmentStore();
</script>

<template>
<div class="app-layout">
  <RouterView />
</div>
</template>

<style scoped>
.app-layout {
  @apply h-screen bg-cover bg-center bg-black bg-opacity-50;
  background-image: url('/background.jpg');
}
</style>