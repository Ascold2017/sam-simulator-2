<template>
  <vk-group>
    <!-- Target-->
    <vk-arc :config="{
      x: 310, y: 310,
      innerRadius: indicatorTarget.radius,
      outerRadius: indicatorTarget.radius,
      angle: indicatorTarget.angle,
      rotation: indicatorTarget.rotation,
      strokeWidth: indicatorTarget.strokeWidth,
      stroke: `rgba(150, 249, 123, ${indicatorTarget.alpha})`
    }" />
    <!-- Target select circle -->
    <vk-circle v-if="indicatorTarget.isDetected && indicatorTarget.isEnemy" :config="{
      x: indicatorTarget.x + 310,
      y: indicatorTarget.y + 310,
      width: 20,
      height: 20,
      strokeWidth: indicatorTarget.isCurrent ? 2 : 0.5,
      dash: indicatorTarget.isCurrent ? [2, 2] : [],
      stroke: indicatorTarget.isSelected ? 'red' : 'rgb(150, 249, 123)'
    }" />
    <!-- Missile select circle -->
    <vk-circle v-if="indicatorTarget.isDetected && !indicatorTarget.isEnemy" :config="{
      x: indicatorTarget.x + 310,
      y: indicatorTarget.y + 310,
      width: 10,
      height: 10,
      strokeWidth: 1,
      stroke: 'red'
    }" />
    <!-- Target approximate hit position -->
    <vk-circle v-if="indicatorTarget.isDetected && indicatorTarget.isEnemy"
      :config="{ x: indicatorTarget.hitPosition.x + 310, y: indicatorTarget.hitPosition.y + 310, width: 3, height: 3, fill: 'white' }" />

  </vk-group>
</template>

<script setup lang="ts">
import { useMainStore, type IRadarObject } from '@/store/main';
import { computed } from 'vue';

interface IRadarIndicatorTarget {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  angle: number;
  strokeWidth: number;
  alpha: number;
  isDetected: boolean;
  isEnemy: boolean;
  isSelected: boolean;
  isCurrent: boolean;
  hitPosition: { x: number; y: number };
}

const props = defineProps<{ target: Partial<IRadarObject>; scale: number }>();

const mainStore = useMainStore();

const indicatorTarget = computed<IRadarIndicatorTarget>(() => {
  const canvasTargetArcAngle = (props.target.size! * 1000 * 180) / (props.target.distance! * Math.PI) + mainStore.samParams.RADAR_AZIMUT_DETECT_ACCURACY * 2;
  const targetSpotDistance = mainStore.samParams.RADAR_DISTANCE_DETECT_ACCURACY / (props.scale * 2);
  return {
    x: props.target.x! / (props.scale * 2),
    y: props.target.y! / (props.scale * 2),
    radius: props.target.distance! / (props.scale * 2),
    rotation: props.target.azimuth! * (180 / Math.PI) - canvasTargetArcAngle / 2,
    angle: canvasTargetArcAngle,
    strokeWidth: targetSpotDistance,
    alpha: props.target.visibilityK! * 1,
    isDetected: props.target.type === 'DETECTED_RADAR_OBJECT',
    isEnemy: props.target.type === 'DETECTED_RADAR_OBJECT' && !props.target.isMissile,
    isSelected: mainStore.selectedTargetIds.includes(props.target.id!),
    isCurrent: mainStore.currentTargetId === props.target.id,
    hitPosition: (() => {
      if (props.target.type !== 'DETECTED_RADAR_OBJECT') return { x: 0, y: 0 }
      return {
        x: props.target.hitPosition!.x / (props.scale * 2),
        y: props.target.hitPosition!.y / (props.scale * 2)
      }
    })()
  }
});

</script>