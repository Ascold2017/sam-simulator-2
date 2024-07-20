<template>
  <v-group :config="groupConfig">
    <v-rect :config="radarConfig" />
    <v-circle :config="radarCircleConfig" />
    <v-text :config="textConfig" />
  </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { EnvironmentRadar } from '@/models/environment.model';

const props = defineProps<{
  radar: EnvironmentRadar;
  scale: number;
  canvasSize: number
}>();

const groupConfig = computed(() => ({
  x: props.radar.position.x * props.scale + props.canvasSize / 2,
  y: props.radar.position.y * props.scale + props.canvasSize / 2,
}))
const radarConfig = computed(() => ({
  x: 0,
  y: 0,
  width: 5,
  height: 5,
  fill: 'blue',
}));

const radarCircleConfig = computed(() => ({
  x: 0,
  y: 0,
  radius: props.radar.maxDistance * props.scale,
  stroke: 'blue',
  strokeWidth: 1,
}));

const textConfig = computed(() => ({
  text: props.radar.name,
  fontSize: 12,
  fill: 'blue',
}));
</script>