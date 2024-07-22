<template>
  <div class="mission-radar">
    <div class="mission-radar__display-container">
      <v-stage :config="stageConfig">
        <RadarWireframe :radar="radar" :canvas-size="canvasSize" :padding="padding" :scale="scale" />
        <v-layer>
          <RadarTargetMarker
            v-for="radarTarget in radarTargets"
            :target="radarTarget.target"
            :radar="radarTarget.radar"
            :canvas-size="canvasSize"
            :scale="scale"
          />
        </v-layer>
      </v-stage>
    </div>
    <div class="mission-radar__button-bar">
      <button class="mission-radar__action-button" @click="setRadarEnabled(true)">ON</button>
      <button class="mission-radar__action-button" @click="setRadarEnabled(false)">OFF</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnvironmentRadar } from '@shared/models/game.model'
import RadarWireframe from './RadarWireFrame.vue';
import RadarTargetMarker from './RadarTargetMarker.vue'
import { computed, watch } from 'vue';
import { useGameStore } from '@/stores/game';

const props = defineProps<{
  radar: EnvironmentRadar;
}>();

const gameStore = useGameStore()

const stageConfig = {
  width: 500,
  height: 500,
};

const padding = 20; // Отступ от краев для размещения надписей азимутов
const canvasSize = 500
const scale = computed(() => {
  const size = 500 - padding * 2; // Размер канваса с учетом отступов
  return size / (props.radar.maxDistance * 2); // Масштаб на основе максимальной дистанции радара
});

const radarTargets = computed(() => {
  if (!gameStore.radarObjectsByRadarIds[props.radar.gameId]) return []
  return gameStore.radarObjectsByRadarIds[props.radar.gameId].map(ro => ({
    id: ro.id,
    target: {
      isDetected: ro.type === "DETECTED_RADAR_OBJECT",
      isSelected: false,
      isMissile: ro.isMissile,
      rotation: ro.rotation * (180 / Math.PI) + 90,
      position: {
        x: ro.x,
        y: ro.y
      },
    },
  }))
})

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