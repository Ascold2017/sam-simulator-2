<template>
    <v-group>
        <!-- Grid lines -->
        <v-line v-for="line in verticalGridLines" :key="'v-' + line.key" :points="line.points" :stroke="'gray'"
            :strokeWidth="0.5" />
        <v-line v-for="line in horizontalGridLines" :key="'h-' + line.key" :points="line.points" :stroke="'gray'"
            :strokeWidth="0.5" />

    </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ canvasSize: number }>()

// Create grid lines with a step of 50 km (100 pixels)
const gridStep = computed(() => props.canvasSize / (1000 / 100));

const verticalGridLines = computed(() => {
    const lines = [];
    for (let x = gridStep.value; x < props.canvasSize; x += gridStep.value) {
        lines.push({
            key: x,
            points: [x, 0, x, props.canvasSize]
        });
    }
    return lines;
});

const horizontalGridLines = computed(() => {
    const lines = [];
    for (let y = gridStep.value; y < props.canvasSize; y += gridStep.value) {
        lines.push({
            key: y,
            points: [0, y, props.canvasSize, y]
        });
    }
    return lines;
});
</script>