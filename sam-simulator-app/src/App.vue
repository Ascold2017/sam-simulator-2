<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
<div class="app-layout">
  <RouterLink :to="{ name: 'gameMap' }">Меню миссии</RouterLink>
  <RouterView />
</div>
</template>

<style scoped>
.app-layout {
  @apply h-screen bg-contain bg-center bg-black bg-opacity-50;
  background-image: url('/background.jpg');
  background-repeat: repeat;
}
</style>