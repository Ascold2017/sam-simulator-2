<template>
  <v-stage v-if="canvasSize" :config="stageConfig" @mousedown.native="onMouseDown" @mousemove.native="onMouseMove"
    @mouseup.native="onMouseUp" @mouseleave.native="onMouseUp" @touchstart.native="onMouseDown"
    @touchmove.native="onMouseMove" @touchend.native="onMouseUp">
    <TvWireframe :canvas-size="canvasSize" :cursor="cursor" />
    <v-layer>
      <v-circle v-for="target in visibleTargets" :key="target.id" :config="getTargetConfig(target)" />
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import type { TargetObjectResponse } from '@shared/models/game.model';
import TvWireframe from './TvWireframe.vue'
import { computed, defineProps, defineEmits, } from 'vue';
import type { CircleConfig } from 'konva/lib/shapes/Circle';
import useJoystick from './useJoystick';

const props = defineProps<{
  cursor: { azimuth: number; elevation: number }
  angleOfView: number;
  targetObjects: TargetObjectResponse[]
}>();
const emit = defineEmits(['moveCursor']);
let canvasSize = 320;
const stageConfig = computed(() => ({
  width: canvasSize,
  height: canvasSize,
}));

const { onMouseDown, onMouseMove, onMouseUp } = useJoystick(computed(() => props.cursor), emit);

const visibleTargets = computed(() =>
  props.targetObjects.filter((target, i) => {
    return (
      Math.abs(target.azimuth - props.cursor.azimuth) <= props.angleOfView / 2 &&
      Math.abs(target.elevation - props.cursor.elevation) <= props.angleOfView / 2
    );
  })
);

const getTargetConfig = (target: TargetObjectResponse): CircleConfig => {
  // Перевод азимута и угла возвышения в координаты x и y
  const relativeAzimuth = target.azimuth - props.cursor.azimuth;
  const relativeElevation = target.elevation - props.cursor.elevation;

  const x = canvasSize / 2 - (relativeAzimuth / props.angleOfView) * (canvasSize);
  const y = canvasSize / 2 - (relativeElevation / props.angleOfView) * (canvasSize);

  return {
    x: x,
    y: y,
    radius: 7,
    fill: 'green',
  };
};
</script>
