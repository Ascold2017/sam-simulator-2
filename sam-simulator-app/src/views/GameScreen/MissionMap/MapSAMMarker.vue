<template>
  <v-group :config="groupConfig">
    <v-regular-polygon :config="samConfig" />
    <v-circle :config="samInnerCircleConfig" />
    <v-circle :config="samOuterCircleConfig" />
    <v-text :config="textConfig" />
  </v-group>
</template>

<script setup lang="ts">
import type { EnvironmentSAM } from '@shared/models/game.model';
import { computed } from 'vue';

const props = defineProps<{
  sam: EnvironmentSAM;
  scale: number;
  canvasSize: number
}>();

const groupConfig = computed(() => ({
  x: props.sam.position.x * props.scale + props.canvasSize / 2,
  y: -props.sam.position.y * props.scale + props.canvasSize / 2,
}))

const samConfig = computed(() => ({
  sides: 3,
  radius: 5,
  fill: 'red',
  rotation: 0,
}));

const samInnerCircleConfig = computed(() => ({
  radius: props.sam.radar.maxDistance * props.scale,
  stroke: 'blue',
  strokeWidth: 1,
}));

const samOuterCircleConfig = computed(() => ({
  radius: props.sam.weapon.weaponMaxDistance * props.scale,
  stroke: 'red',
  strokeWidth: 1,
}));

const textConfig = computed(() => ({
  text: props.sam.name,
  fontSize: 12,
  fill: 'red',
}));
</script>