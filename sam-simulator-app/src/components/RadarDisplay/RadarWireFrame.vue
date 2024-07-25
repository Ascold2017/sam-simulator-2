<template>
    <v-layer>
        <v-text :text="radarDistanceLabel" :x="canvasSize - 75" :y="padding" :fill="'rgb(150, 249, 123)'" />
        <v-circle v-for="range in radarRanges" :key="range" :radius="range * scale" :x="center" :y="center"
            :stroke="'gray'" :strokeWidth="0.5" />
        <v-line v-for="azimuth in azimuths" :key="azimuth.value" :points="azimuth.points" :stroke="'rgb(150, 249, 123)'"
            :strokeWidth="0.1" />
        <v-text v-for="azimuth in azimuths" :key="'text-' + azimuth.value" :text="azimuth.value.toString()"
            :x="azimuth.textPosition.x" :y="azimuth.textPosition.y" :rotation="azimuth.value"
            :fill="'rgb(150, 249, 123)'" :align="'center'" :offsetX="12.5" :offsetY="2.5" :width="25" :height="12"
            :fontFamily="'DS-Digital, sans-serif'" :fontSize="11" />
    </v-layer>
</template>

<script setup lang="ts">
import type { EnvironmentRadar } from '@shared/models/game.model'
import { computed } from 'vue';

const props = defineProps<{
    radar: EnvironmentRadar;
    canvasSize: number;
    padding: number;
    scale: number;
}>();


interface Azimuth {
    value: number;
    points: number[];
    textPosition: { x: number; y: number };
}

const center = computed(() => props.canvasSize / 2);

const radarRanges = computed(() => {
    let step: number;
    if (props.radar.maxDistance <= 50000) {
        step = 5000;
    }
    else if (props.radar.maxDistance <= 100000) {
        step = 10000;
    }
    else if (props.radar.maxDistance <= 200000) {
        step = 25000;
    }
    else {
        step = 50000;
    }

    const ranges: number[] = [];
    for (let i = step; i <= props.radar.maxDistance; i += step) {
        ranges.push(i);
    }
    return ranges;
});

const azimuths = computed<Azimuth[]>(() => {
    const azimuths: Azimuth[] = [];
    for (let i = 0; i < 360; i += 10) {
        const angle = (i) * (Math.PI / 180) - Math.PI/2;
        const outerRadius = props.canvasSize / 2 - props.padding;
        const innerRadius = props.padding / 2;
        const x = center.value + Math.cos(angle) * outerRadius;
        const y = center.value + Math.sin(angle) * outerRadius;
        const innerX = center.value + Math.cos(angle) * innerRadius;
        const innerY = center.value + Math.sin(angle) * innerRadius;

        const textRadius = props.canvasSize / 2 - props.padding / 2;
        const textX = center.value + Math.cos(angle) * textRadius;
        const textY = center.value + Math.sin(angle) * textRadius;

        azimuths.push({
            value: i,
            points: [innerX, innerY, x, y],
            textPosition: { x: textX, y: textY }
        });
    }
    return azimuths;
});

const radarDistanceLabel = computed(() => `D ${props.radar.maxDistance / 1000} km`)
</script>