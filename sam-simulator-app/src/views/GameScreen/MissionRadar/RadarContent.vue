<template>
  <div class="mission-radar">
    <div class="mission-radar__display-container">
      <RadarDisplay :radar="radar" :radar-objects="radarObjects" :is-enabled="radarEnabled"/>
    </div>
    <div class="mission-radar__button-bar">
      <button class="mission-radar__action-button" @click="setRadarEnabled(true)">ON</button>
      <button class="mission-radar__action-button" @click="setRadarEnabled(false)">OFF</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnvironmentRadar } from '@shared/models/game.model'
import RadarDisplay from '@/components/RadarDisplay/index.vue'
import { computed, watch } from 'vue';
import { useGameStore } from '@/stores/game';

const props = defineProps<{
  radar: EnvironmentRadar;
}>();

const gameStore = useGameStore()

const radarObjects = computed(() =>gameStore.radarObjectsByRadarIds[props.radar.gameId] || [])
const radarEnabled = computed(() => gameStore.radarsEnabled[props.radar.gameId] || false)

function setRadarEnabled(value: boolean) {
  gameStore.setEnableRadar(props.radar.gameId, value)
}
</script>

<style scoped>
.mission-radar {
  @apply flex flex-row p-6 bg-neutral-900 rounded-lg shadow-lg;
  @apply w-[max-content] mx-auto;
  /* Добавление фиксированной ширины и центрирование */
}

.mission-radar__display-container {
  @apply relative w-[500px] h-[500px] bg-black rounded-lg;
  box-shadow: inset 0 0 5px white;
}

.mission-radar__button-bar {
  @apply flex flex-col ml-4 space-y-2;
}

.mission-radar__action-button {
  @apply w-12 h-12 bg-neutral-700 text-white border-none cursor-pointer;
  @apply shadow-sm shadow-neutral-400 hover:bg-neutral-600;
}
</style>