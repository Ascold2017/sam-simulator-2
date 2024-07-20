<template>
    <div class="mission-map-tab">
        <div class="mission-map-tab__card">
            <div class="mission-map-tab__inner-shadow"></div>
            <v-stage ref="stage" :config="stageConfig" class="mission-map-tab__stage">
                <v-layer>
                    <v-image :config="imageConfig" />
                    <!-- Здесь можно добавить другие объекты на карту -->
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMissionStore } from '@/stores/mission';
import { useImage } from '@/utils/useImage';
import { ref, onMounted, watch, computed } from 'vue';

const missionStore = useMissionStore()

const stageConfig = {
    width: 500,
    height: 500,
};

const { image, error, isLoading } = useImage(missionStore.selectedMission.map1024);

// Настройки изображения
const imageConfig = computed(() => ({
    x: 0,
    y: 0,
    image: image.value,
    width: 500,
    height: 500,
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