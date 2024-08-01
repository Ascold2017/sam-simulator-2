<template>
  <v-stage :config="stageConfig" v-if="canvasSize">
    <RadarWireframe :radar="radar" :canvas-size="canvasSize" :padding="padding" :scale="scale" :map-image="mapImage"/>
    <RadarScanner :canvasSize="canvasSize" :padding="padding" :cursorAngle="cursorAngle" :is-enabled="radar.isEnabled"/>
    <RadarTargetCursor v-if="targetCursorAngle !== undefined" :targetCursorAngle="targetCursorAngle" :canvasSize="canvasSize" :padding="padding" />
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
import RadarTargetCursor from './RadarTargetCursor.vue';
import type { EnvironmentRadar, RadarObjectResponse } from '@shared/models/game.model'
import { computed } from 'vue';

const props = defineProps<{
  radar: EnvironmentRadar
  radarObjects: RadarObjectResponse[];
  cursorAngle: number;
  mapImage: string;
  targetCursorAngle?: number
}>()
const padding = 20; // Отступ от краев для размещения надписей азимутов
let canvasSize = 320
const stageConfig = computed(() => ({
  width: canvasSize,
  height: canvasSize,
}))


const scale = computed(() => {
  const size = canvasSize - padding * 2; // Размер канваса с учетом отступов
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
      azimuth: ro.azimuth,
      distance: ro.distance
    },
  }))
})
</script>