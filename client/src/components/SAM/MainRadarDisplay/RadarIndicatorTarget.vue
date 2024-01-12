<template>
  <vk-group>
    <vk-arc :config="{
      x: 310, y: 310,
      innerRadius: indicatorTarget.radius,
      outerRadius: indicatorTarget.radius,
      angle: indicatorTarget.angle,
      rotation: indicatorTarget.rotation,
      strokeWidth: indicatorTarget.strokeWidth,
      stroke: `rgba(150, 249, 123, ${indicatorTarget.alpha})`
    }" />
    <vk-arc v-if="indicatorTarget.isDetected && indicatorTarget.isEnemy" :config="{
      x: indicatorTarget.x + 310,
      y: indicatorTarget.y + 310,
      innerRadius: 10,
      outerRadius: 10,
      strokeWidth: indicatorTarget.isCurrent ? 2 : 0.5,
      dash: indicatorTarget.isCurrent ? [2, 2] : [],
      angle: 360,
      stroke: indicatorTarget.isSelected ? 'red' : 'rgb(150, 249, 123)'
    }" />
    <vk-arc v-if="indicatorTarget.isDetected && !indicatorTarget.isEnemy" :config="{
      x: indicatorTarget.x + 310,
      y: indicatorTarget.y + 310,
      innerRadius: 5,
      outerRadius: 5,
      strokeWidth: 1,
      angle: 360,
      stroke: 'red'
    }" />

    <vk-group v-if="indicatorTarget.isDetected && indicatorTarget.isEnemy" :config="{
      x: indicatorTarget.x + 310,
      y: indicatorTarget.y + 310, rotation: indicatorTarget.direction
    }">
      <vk-line :config="{ points: [10, 0, indicatorTarget.l, 0], stroke: 'white', strokeWidth: 1 }" />
    </vk-group>
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
  direction: number;
  timeToHit: number;
  l: number;
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
    direction: props.target.rotation! * (180 / Math.PI),
    timeToHit: props.target.distance! / Math.abs(mainStore.samParams.MISSILE_VELOCITY + props.target.radialVelocity!),
    l: (() => {
      if (props.target.type !== 'DETECTED_RADAR_OBJECT') return 0;
      const time = props.target.distance! / Math.abs(mainStore.samParams.MISSILE_VELOCITY + props.target.radialVelocity!);
      return (props.target.velocity! * time) / (props.scale * 2);

    })(),
  }
});

</script>