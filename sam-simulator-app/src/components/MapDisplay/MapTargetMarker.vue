<template>
    <v-group :x="scaledX" :y="scaledY">
        <v-regular-polygon :config="{
            sides: 3,
            radius: 5,
            fill: 'red',
            rotation: 0,
        }" />
    </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    target: {
        x: number;
        y: number;
    },
    canvasSize: number;
    scale: number
}>()
const center = computed(() => props.canvasSize / 2);

// Calculate scaledX and scaledY using azimuth and distance
const scaledX = computed(() => {
    return center.value + props.target.x * props.scale;
});

const scaledY = computed(() => {
    return center.value - props.target.y * props.scale;
});

</script>