<template>
    <v-group :x="scaledX" :y="scaledY">
        <v-circle :radius="radius" :stroke="markerColor" strokeWidth="1" fill="none" />
        <v-line v-if="target.isDetected" :points="nosePoints" :stroke="markerColor" strokeWidth="1" />
        <v-text  v-if="target.isDetected" :text="(index + 1).toString()" fill="rgb(150, 249, 123)" x="8" y="-4" />
    </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    index: number;
    target: {
        position: { x: number; y: number },
        rotation: number;
        isSelected: boolean;
        isDetected: boolean;
        isMissile: boolean;
    },
    canvasSize: number;
    scale: number
}>()
const center = computed(() => props.canvasSize / 2);

const scaledX = computed(() => center.value + props.target.position.x * props.scale);
const scaledY = computed(() => center.value + props.target.position.y * props.scale);

const radius = computed(() => (props.target.isMissile ? 2.5 : 5));
const markerColor = computed(() => (props.target.isSelected ? 'red' : 'rgb(150, 249, 123)'));

const nosePoints = computed(() => {
    const angleRad = (props.target.rotation - 90) * (Math.PI / 180);
    const noseX = Math.cos(angleRad) * (radius.value + 10);
    const noseY = Math.sin(angleRad) * (radius.value + 10);
    return [0, 0, noseX, noseY];
});
</script>