<template>
  <div class="mission-sam">
    <div class="mission-sam__display-container">
      <RadarDisplay :radarObjects="radarObjects" :radar="sam.radar" />
      <SAMTargets :radarObjects="radarObjects" />
    </div>
    <div class="mission-sam__button-bar">
      <button class="mission-sam__action-button" @click="setRadarEnabled(true)">ON</button>
      <button class="mission-sam__action-button" @click="setRadarEnabled(false)">OFF</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnvironmentSAM } from '@shared/models/game.model'
import RadarDisplay from '@/components/RadarDisplay/index.vue'
import SAMTargets from './SAMTargets.vue';
import { useGameStore } from '@/stores/game';
import { computed } from 'vue';
const props = defineProps<{
  sam: EnvironmentSAM;
}>();

const gameStore = useGameStore()

const radarObjects = computed(() => gameStore.radarObjectsByRadarIds[props.sam.radar.gameId] || [])

function setRadarEnabled(value: boolean) {
  gameStore.setEnableRadar(props.sam.radar.gameId, value)
}
</script>

<style scoped>
.mission-sam {
  @apply flex flex-row p-6 bg-neutral-900 rounded-lg shadow-lg;
  @apply w-[max-content] mx-auto;
  /* Добавление фиксированной ширины и центрирование */
}

.mission-sam__display-container {
  @apply relative w-[700px] h-[500px] bg-black rounded-lg flex;
  box-shadow: inset 0 0 5px white;
}

.mission-sam__button-bar {
  @apply flex flex-col ml-4 space-y-2;
}

.mission-sam__action-button {
  @apply w-12 h-12 bg-neutral-700 text-white border-none cursor-pointer;
  @apply shadow-sm shadow-neutral-400 hover:bg-neutral-600;
}
</style>