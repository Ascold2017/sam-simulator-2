<template>
    <div class="panel">
        <div class="panel-display">
            <v-stage ref="stage" :config="stageConfig" class="mission-map-tab__stage">
                <v-layer>
                    <v-image :config="imageConfig" v-if="image"/>
                    <RadarMarker v-for="radar in radars" :key="radar.id" :radar="radar" :scale="scale" :canvasSize="canvasSize" />
                    <SAMMarker v-for="sam in sams" :key="sam.id" :sam="sam" :scale="scale" :canvasSize="canvasSize" />
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>

<script setup lang="ts">
import RadarMarker from './RadarMarker.vue'
import SAMMarker from './MapSAMMarker.vue'
import { useImage } from '@/utils/useImage';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore()
const { currentMission, radars, sams } = storeToRefs(gameStore)

const canvasSize = 500
const scale = canvasSize / 2000000; // 500 пикселей на 1000 километров (1 км = 2 пикселя)

const stageConfig = {
    width: canvasSize,
    height: canvasSize,
};

const { image } = useImage(computed(() => currentMission.value.map1024));

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