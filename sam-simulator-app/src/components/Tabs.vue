<template>
    <div class="tabs">
      <div class="tabs__header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tabs__tab', { 'tabs__tab--active': tab.id === activeTab }]"
          @click="handleTabClick(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps<{
    tabs: { id: string; label: string }[];
    activeTab: string;
  }>();
  
  const emit = defineEmits<{
    (event: 'tab-click', id: string): void;
  }>();
  
  const handleTabClick = (id: string) => {
    emit('tab-click', id);
  };
  </script>
  
  <style scoped>
  .tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .tabs__header {
    display: flex;
  }
  
  .tabs__tab {
    padding: 8px 16px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 4px;
    margin-right: 8px;
  }
  
  .tabs__tab--active {
    background: #007bff;
  }

  </style>