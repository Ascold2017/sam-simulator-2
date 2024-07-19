<template>
  <div class="game-screen">
    <header class="game-screen__header">
      <Tabs :tabs="tabs" @tab-click="activeTab = $event" :activeTab="activeTab" />
      <div class="game-screen__actions">
        <button class="game-screen__connection-button">📡</button>
        <MissionLogsDropdown class="game-screen__dropdown" />
      </div>
    </header>

    <main class="game-screen__main-content">
      <MissionMapTab v-if="activeTab === 'map'" />
    </main>
  </div>


</template>

<script setup lang="ts">
import Tabs from '@/components/Tabs.vue'
import MissionMapTab from './MissionMapTab.vue'
import MissionLogsDropdown from './MissionLogsDropdown.vue'
import { useEnvironmentStore } from '@/stores/environment';
import { ref } from 'vue';

const environmentStore = useEnvironmentStore();

const tabs = [
  { id: 'map', label: 'Карта миссии' },
  { id: 'radar', label: 'Радар 1' },
  { id: 'sam', label: 'ЗРК-1' }
];
const activeTab = ref<string>('map');
</script>

<style scoped>
.game-screen {
  @apply flex flex-col h-full;
}

.game-screen__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  /* Темный фон для контраста */
}

.game-screen__actions {
  display: flex;
  align-items: center;
}

.game-screen__connection-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 16px;
  cursor: pointer;
}

.game-screen__connection-button:hover {
  background: #0056b3;
}

.game-screen__dropdown {
  margin-left: 16px;
}

.game-screen__main-content {
  flex: 1;
  padding: 16px;
}
</style>