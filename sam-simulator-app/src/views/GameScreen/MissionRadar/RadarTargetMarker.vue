<template>
    <v-group :x="scaledX" :y="scaledY">
        <v-circle :radius="radius" :stroke="markerColor" strokeWidth="1" fill="none" />
        <v-line v-if="isDetected" :points="nosePoints" :stroke="markerColor" strokeWidth="1" />
    </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    position: { x: number; y: number };
    rotation: number;
    isSelected: boolean;
    isDetected: boolean;
    isMissile: boolean;
    canvasSize: number;
    scale: number
}>()
const center = computed(() => props.canvasSize / 2);

const scaledX = computed(() => center.value + props.position.x * props.scale);
const scaledY = computed(() => center.value - props.position.y * props.scale);

const radius = computed(() => (props.isMissile ? 2.5 : 5));
const markerColor = computed(() => (props.isSelected ? 'red' : 'rgb(150, 249, 123)'));

const nosePoints = computed(() => {
    const angle = props.rotation;
    const x = Math.cos(angle) * radius.value;
    const y = Math.sin(angle) * radius.value;
    const noseX = Math.cos(angle) * (radius.value + 10);
    const noseY = Math.sin(angle) * (radius.value + 10);
    return [x, y, noseX, noseY];
});
</script>