<template>
    <div class="logs-dropdown">
      <button @click="toggleDropdown">Логи</button>
      <ul v-if="showDropdown" class="logs-list">
        <li v-for="log in logs" :key="log.id">{{ log.message }}</li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const showDropdown = ref(false);
  const logs = ref([
  { id: 1, message: 'Миссия началась' },
  { id: 2, message: 'Цель обнаружена' },
  { id: 3, message: 'Ракета запущена' },
  // Добавьте другие логи здесь
]);
  
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };
  </script>
  
  <style scoped>
  .logs-dropdown {
    @apply relative;
  }
  
  .logs-dropdown button {
    @apply px-4 py-2 bg-gray-200 rounded cursor-pointer;
  }
  
  .logs-list {
    @apply absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10;
  }
  
  .logs-list li {
    @apply px-4 py-2 hover:bg-gray-100;
  }
  </style>