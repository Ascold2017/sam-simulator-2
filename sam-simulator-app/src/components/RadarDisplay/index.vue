<template>
  <v-stage :config="stageConfig">
    <RadarWireframe :radar="radar" :canvas-size="canvasSize" :padding="padding" :scale="scale" />
    <RadarScanner :canvasSize="canvasSize" :padding="padding" :cursorAngle="cursorAngle" />
    <v-layer>
      <RadarTargetMarker v-for="(radarTarget, i) in radarTargets" :target="radarTarget.target" :canvas-size="canvasSize"
        :scale="scale" :index="i" />
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import RadarScanner from './RadarScanner.vue'
import RadarWireframe from './RadarWireFrame.vue';
import RadarTargetMarker from './RadarTargetMarker.vue'
import type { EnvironmentRadar, RadarObjectResponse } from '@shared/models/game.model'
import { computed } from 'vue';

const props = defineProps<{
  radar: EnvironmentRadar
  radarObjects: RadarObjectResponse[];
  cursorAngle: number;
}>()
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
  return props.radarObjects.map(ro => ({
    id: ro.id,
    target: {
      isDetected: ro.type === "DETECTED_RADAR_OBJECT",
      isSelected: false,
      isMissile: ro.isMissile,
      rotation: ro.rotation * (180 / Math.PI),
      position: {
        x: ro.x,
        y: ro.y
      },
    },
  }))
})
</script>