<template>
    <v-stage ref="stage" :config="stageConfig" class="mission-map-tab__stage">
        <v-layer>
            <v-image :config="imageConfig" v-if="image" />
            <MapWireframe :canvas-size="canvasSize" />
            <RadarMarker v-for="radar in radars" :key="radar.id" :radar="radar" :scale="scale"
                :canvasSize="canvasSize" />
            <SAMMarker v-for="sam in sams" :key="sam.id" :sam="sam" :scale="scale" :canvasSize="canvasSize" />
        </v-layer>
        <v-layer>
            <MapTargetMarker v-for="ro in radarObjects" :key="ro.id" :canvasSize="canvasSize" :scale="scale" :target="{
                x: ro.x,
                y: ro.y
            }" />
        </v-layer>
    </v-stage>
</template>

<script setup lang="ts">
import type { EnvironmentRadar, EnvironmentSAM, RadarObjectResponse } from '@shared/models/game.model';
import { useImage } from '@/utils/useImage';
import RadarMarker from './RadarMarker.vue'
import SAMMarker from './MapSAMMarker.vue'
import MapWireframe from './MapWireframe.vue'
import MapTargetMarker from './MapTargetMarker.vue'
import { computed } from 'vue';

const props = defineProps<{
    radars: EnvironmentRadar[];
    sams: EnvironmentSAM[];
    radarObjects: RadarObjectResponse[];
    mapSrc: string;
}>()
const canvasSize = 500
const scale = canvasSize / 1000000; // 500 пикселей на 1000 километров (1 км = 2 пикселя)

const stageConfig = {
    width: canvasSize,
    height: canvasSize,
};

const { image } = useImage(computed(() => props.mapSrc));

// Настройки изображения
const imageConfig = computed(() => ({
    x: 0,
    y: 0,
    image: image.value,
    width: canvasSize,
    height: canvasSize,
    cornerRadius: 8
}));
</script>
