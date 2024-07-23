<template>
    <v-stage :config="stageConfig">
        <v-layer>
            <template v-for="(object, index) in radarObjects" :key="object.id">
                <v-rect 
                    :x="10" 
                    :y="index * itemHeight + 10" 
                    :width="boxWidth" 
                    :height="boxHeight" 
                    stroke="white" 
                    strokeWidth="1" 
                    fill="none" 
                />
                <v-text 
                    :x="10" 
                    :y="index * itemHeight + 10" 
                    :text="formatText(object, index)" 
                    fontSize="12" 
                    fill="white"
                />
            </template>
        </v-layer>
    </v-stage>
</template>

<script setup lang="ts">
import type { RadarObjectResponse } from '@shared/models/game.model'
const props = defineProps<{
    radarObjects: RadarObjectResponse[]
}>();

const stageConfig = {
  width: 200,
  height: 500,
};

const boxWidth = 180;
const boxHeight = 100;
const itemHeight = boxHeight + 10;

const formatText = (object: RadarObjectResponse, index: number) => `
  ${index + 1}.
  D: ${(object.distance / 1000).toFixed(1)} km
  Azimuth: ${(object.azimuth * (180 / Math.PI)).toFixed(1)}
  Elevation: ${object.elevation.toFixed(0)}
  Vr: ${object.radialVelocity.toFixed(0)} m/s V: ${object.velocity.toFixed(0)} m/s
  H: ${object.height.toFixed(0)} m  P: ${object.param.toFixed(0)} m
  Rotation: ${(object.rotation * (180 / Math.PI)).toFixed(1)}
`;
</script>