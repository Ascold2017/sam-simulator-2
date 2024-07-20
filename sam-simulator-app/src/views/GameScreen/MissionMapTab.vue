<template>
    <div class="mission-map-tab">
        <div class="mission-map-tab__card">
            <div class="mission-map-tab__inner-shadow"></div>
            <v-stage ref="stage" :config="stageConfig" class="mission-map-tab__stage">
                <v-layer>
                    <v-image :config="imageConfig" />
                    <RadarMarker v-for="radar in radars" :key="radar.id" :radar="radar" :scale="scale" :canvasSize="canvasSize" />
                    <SAMMarker v-for="sam in sams" :key="sam.id" :sam="sam" :scale="scale" :canvasSize="canvasSize" />
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>

<script setup lang="ts">
import RadarMarker from './MissionMapRadarMarker.vue'
import SAMMarker from './MissionMapSAMMarker.vue'
import { useEnvironmentStore } from '@/stores/environment';
import { useMissionStore } from '@/stores/mission';
import { useImage } from '@/utils/useImage';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const missionStore = useMissionStore()
const { selectedMission } = storeToRefs(missionStore)

const environmentStore = useEnvironmentStore();
const { radars, sams } = storeToRefs(environmentStore);

const canvasSize = 500
const scale = canvasSize / 2000000; // 500 пикселей на 1000 километров (1 км = 2 пикселя)

const stageConfig = {
    width: canvasSize,
    height: canvasSize,
};

const { image } = useImage(computed(() => selectedMission.value.map1024));

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

<style scoped>
.mission-map-tab {
    @apply flex flex-col items-center justify-center;
}

.mission-map-tab__card {
    @apply bg-black p-6 rounded-lg shadow-lg relative;
}

.mission-map-tab__inner-shadow {
    @apply absolute inset-4 pointer-events-none rounded-lg;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.7);
    z-index: 1;
    /* Помещаем тень под содержимое канваса */


}

.mission-map-tab__stage {
    @apply relative rounded-lg;
}
</style>