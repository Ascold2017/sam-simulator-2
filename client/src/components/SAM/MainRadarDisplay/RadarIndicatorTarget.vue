<template>
  <vk-group>
    <!-- Target-->
    <vk-group :config="{ x: indicatorTarget.x, y: indicatorTarget.y }">
      <vk-line :config="{
        points: [-indicatorTarget.size/2, 0, indicatorTarget.size/2, 0],
        strokeWidth: indicatorTarget.strokeWidth,
        stroke: `rgba(150, 249, 123, ${indicatorTarget.alpha})`
        }"
      />
      <!-- Target select circle -->
      <vk-rect v-if="indicatorTarget.isDetected && indicatorTarget.isEnemy" :config="{
        x: -10,
        y: -5,
        width: 20,
        height: 10,
        strokeWidth: indicatorTarget.isCurrent ? 2 : 0.5,
        dash: indicatorTarget.isCurrent ? [2, 2] : [],
        stroke: indicatorTarget.isSelected ? 'red' : 'rgb(150, 249, 123)'
      }" />
      <!-- Missile select circle -->
      <vk-rect v-if="indicatorTarget.isDetected && !indicatorTarget.isEnemy" :config="{
        x: -5,
        y: -5,
        width: 10,
        height: 10,
        strokeWidth: 1,
        stroke: 'red'
      }" />
    </vk-group>
    <!-- Target approximate hit position -->
    <vk-circle v-if="indicatorTarget.isDetected && indicatorTarget.isEnemy"
      :config="{ x: indicatorTarget.hitPosition.x, y: indicatorTarget.hitPosition.y, width: 3, height: 3, fill: 'white' }" />
  
  </vk-group>
</template>

<script setup lang="ts">
import { useMainStore, type IRadarObject } from '@/store/main';
import { computed } from 'vue';

interface IRadarIndicatorTarget {
  x: number;
  y: number;
  size: number;
  strokeWidth: number;
  alpha: number;
  isDetected: boolean;
  isEnemy: boolean;
  isSelected: boolean;
  isCurrent: boolean;
  hitPosition: { x: number; y: number };
}

const props = defineProps<{ target: Partial<IRadarObject>; scale: number; gridHeight: number; gridWidth: number; }>();

const mainStore = useMainStore();

const indicatorTarget = computed<IRadarIndicatorTarget>(() => {
  const targetSpotDistance = mainStore.samParams.RADAR_DISTANCE_DETECT_ACCURACY / props.scale;
  return {
    x: ((props.target.azimuth! * (180 / Math.PI)) / 360) * props.gridWidth,
    y: props.gridHeight - (props.target.distance! / props.scale),
    size: 10,
    strokeWidth: targetSpotDistance,
    alpha: props.target.visibilityK! * 1,
    isDetected: props.target.type === 'DETECTED_RADAR_OBJECT',
    isEnemy: props.target.type === 'DETECTED_RADAR_OBJECT' && !props.target.isMissile,
    isSelected: mainStore.selectedTargetIds.includes(props.target.id!),
    isCurrent: mainStore.currentTargetId === props.target.id,
    hitPosition: (() => {
      if (props.target.type !== 'DETECTED_RADAR_OBJECT') return { x: 0, y: 0 }
      const hitPositionAzimith = Math.atan2(props.target.hitPosition!.y, props.target.hitPosition!.x)
      const distance = Math.hypot(props.target.hitPosition!.x, props.target.hitPosition!.y);
      return {
        x: ((hitPositionAzimith * (180 / Math.PI)) / 360) * props.gridWidth,
        y: props.gridHeight - distance / props.scale
      }
    })()
  }
});

</script>