<template>
    <div class="mission-map-tab">
        <v-stage ref="stage" :config="stageConfig">
            <v-layer>
                <v-image :config="imageConfig" />
                <!-- Здесь можно добавить другие объекты на карту -->
            </v-layer>
        </v-stage>
    </div>
</template>

<script setup lang="ts">
import { useImage } from '@/utils/useImage';
import { ref, onMounted, watch, computed } from 'vue';

const imageUrl = ref('https://via.placeholder.com/500');

const stageConfig = {
  width: 500,
  height: 500,
};

const { image, error, isLoading } = useImage(imageUrl.value);

// Настройки изображения
const imageConfig = computed(() => ({
  x: 0,
  y: 0,
  image: image.value,
  width: 500,
  height: 500,
}));

</script>

<style scoped>
.mission-map-tab {
    @apply flex flex-col items-center justify-center;
}
</style>