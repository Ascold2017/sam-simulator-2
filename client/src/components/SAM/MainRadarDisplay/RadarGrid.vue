<template>
  <vk-group>
    <vk-rect :config="{ x: 0, y: 0, width: gridWidth, height: gridHeight, fill: 'rgb(15, 33, 19)' }" />
    <!-- Distance circles -->
    <vk-line
      :config="{ points: [0, (i * 10000) / scale, gridWidth, (i * 10000) / scale], stroke: 'rgb(150, 249, 123)', strokeWidth: 0.1 }"
      v-for="i in countLines" />
    <!-- Max capture range circle -->
    <vk-line
      :config="{ points: [0, gridHeight - samSettings.samParams.MAX_CAPTURE_RANGE / scale, gridWidth, gridHeight - samSettings.samParams.MAX_CAPTURE_RANGE / scale], stroke: 'rgb(150, 249, 123)', dash: [2, 5], strokeWidth: 1.5 }" />
    <!-- Min capture range circle -->
    <vk-line
      :config="{ points: [0, gridHeight - samSettings.samParams.MIN_CAPTURE_RANGE / scale, gridWidth, gridHeight - samSettings.samParams.MIN_CAPTURE_RANGE / scale], stroke: 'rgb(150, 249, 123)', dash: [2, 5], strokeWidth: 1.5 }" />
    <!-- Killzone circle -->
    <vk-line
      :config="{ points: [0, gridHeight - samSettings.samParams.MISSILE_MAX_DISTANCE / scale, gridWidth, gridHeight - samSettings.samParams.MISSILE_MAX_DISTANCE / scale], stroke: 'red', strokeWidth: 0.5 }" />
    <!-- Azimut lines -->
    <vk-line :config="{
      points: [azimutLine.x , 0, azimutLine.x, gridHeight],
      stroke: 'rgb(150, 249, 123)',
      strokeWidth: 0.1
    }" v-for="azimutLine in azimutLines" />
    <!-- Azimut labels -->
    <vk-text :config="{
      x: azimutLine.x,
      y: gridHeight,
      text: azimutLine.angleLabel,
      offsetX: 12.5,
      offsetY: -12.5,
      align: 'center',
      verticalAlign: 'middle',
      fontFamily: 'DS-Digital, sans-serif',
      fill: 'rgb(150, 249, 123)',
      fontSize: 11,
      width: 25,
      height: 12
    }" v-for="azimutLine in azimutLines" />
    <vk-text
      :config="{ x: 670, y: 0, text: 'UPDATE', align: 'center', width: 100, fontFamily: 'DS-DigitalB, sans-serif', fontSize: 14, fill: radarObjects.isUpdated ? 'red' : 'white' }" />

  </vk-group>
</template>

<script setup lang="ts">
import { useRadarObjects } from '@/store/sam/radarObjects';
import { useSamSettings } from '@/store/sam/settings';
import { computed } from 'vue';

const props = defineProps<{ scale: number; gridWidth: number; gridHeight: number; }>();
const samSettings = useSamSettings()
const radarObjects = useRadarObjects()

const countLines = computed(() => samSettings.samParams!.MAX_DISTANCE / 10000);
const azimutLines = computed(() => {
  return Array(36).fill(0).map((_, i) => {
    const gap = props.gridWidth / 36;
    return {
      x: gap * i,
      angleLabel: String(i * 10),
    }
  });
});
</script>
