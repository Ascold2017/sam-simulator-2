<template>
    <v-stage :config="stageConfig">
        <v-layer>
            <template v-for="(object, index) in detectedRadarObjects" :key="object.id">
                <v-rect :x="10" :y="index * itemHeight + 10" :width="boxWidth" :height="boxHeight" stroke="rgb(150, 249, 123)"
                    strokeWidth="1" fill="none" />
                <v-text :x="10" :y="index * itemHeight + 10" :text="formatText(object, index)" fontSize="12"
                    fill="rgb(150, 249, 123)" :fontFamily="'DS-Digital, sans-serif'"/>
            </template>
        </v-layer>
    </v-stage>
</template>

<script setup lang="ts">
import type { RadarObjectResponse } from '@shared/models/game.model'
import { computed } from 'vue';
const props = defineProps<{
    radarObjects: RadarObjectResponse[]
}>();

const stageConfig = {
    width: 200,
    height: 320,
};

const boxWidth = 180;
const boxHeight = 50;
const itemHeight = boxHeight + 10;
const detectedRadarObjects = computed(() => props.radarObjects.filter(ro => ro.type === 'DETECTED_RADAR_OBJECT'))
const formatText = (object: RadarObjectResponse, index: number) => {
    const azimuthDegrees = ((object.azimuth + Math.PI / 2) * (180 / Math.PI));
    const adjustedAzimuth = (azimuthDegrees > 360) ? azimuthDegrees - 360 : azimuthDegrees;
    return ` ${index + 1}. D: ${(object.distance / 1000).toFixed(1)} km H: ${object.height.toFixed(0)} m
    Azimuth: ${adjustedAzimuth.toFixed(1)} Elevation: ${(object.elevation * (180 / Math.PI)).toFixed(1)}
    Vr: ${object.radialVelocity.toFixed(0)} m/s V: ${object.velocity.toFixed(0)} m/s
    P: ${object.param.toFixed(0)} m
`
};
</script>