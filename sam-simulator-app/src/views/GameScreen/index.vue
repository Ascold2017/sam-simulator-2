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
      <component 
        v-for="radar in gameStore.radars" 
        :key="radar.id" 
        :is="activeTab === radar.id.toString() ? MissionRadar : null" 
        :radar="radar" 
      />
    </main>
  </div>


</template>

<script setup lang="ts">
import Tabs from '@/components/Tabs.vue'
import MissionMapTab from './MissionMap/MapContent.vue'
import MissionRadar from './MissionRadar/RadarContent.vue'
import MissionLogsDropdown from './MissionLogsDropdown.vue'
import { computed, onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore()

const tabs = computed(() => {
  return [
    { id: 'map', label: 'Карта миссии' },
    ...gameStore.radars.map(r => ({ id: r.id.toString(), label: r.name })),
    ...gameStore.sams.map(r => ({ id: r.id.toString(), label: r.name }))
  ]
});

const activeTab = ref<string>('map');

onMounted(() => {
  gameStore.getCurrentMission()
})
</script>

<style scoped>
.game-screen {
  @apply flex flex-col h-full;
}

.game-screen__header {
  @apply flex justify-between items-center p-4 bg-black bg-opacity-60;
}

.game-screen__actions {
  @apply flex items-center gap-4;
}

.game-screen__connection-button {
  @apply bg-blue-500 text-white border-none py-2 px-4 rounded cursor-pointer;
}

.game-screen__connection-button:hover {
  @apply bg-blue-700;
}

.game-screen__dropdown {
  /* Добавьте стили при необходимости */
}

.game-screen__main-content {
  @apply flex-1 p-4;
}
</style>