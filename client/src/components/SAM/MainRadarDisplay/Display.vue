<template>
    <vk-group :config="{ x: 20, y: 20 }">
        <vk-rect :config="{
            name: 'display',
            x: -5,
            y: -5,
            width: 830,
            height: 630,
            fill: 'black',
        }" />
        <radar-grid v-if="mainStore.isEnabled" :scale="scale" :gridHeight="gridHeight" :gridWidth="gridWidth" />
        <!-- targets -->
        <vk-group>
            <RadarIndicatorTarget v-for="radarObject in mainStore.radarObjects" :scale="scale" :gridHeight="gridHeight"
                :gridWidth="gridWidth" :target="radarObject" />
            <RadarIndicatorInfo v-for="(targetObject, i) in mainStore.detectedEnemies" :index="i"
                :config="{ x: 622, y: 20 }" :target="targetObject" />
        </vk-group>
    </vk-group>
</template>
  
<script setup lang="ts">
import { useMainStore } from '@/store/main';
import RadarGrid from "@/components/SAM/MainRadarDisplay/RadarGrid.vue";
import RadarIndicatorTarget from './RadarIndicatorTarget.vue';
import RadarIndicatorInfo from './RadarIndicatorInfo.vue';
import { computed } from 'vue';

const mainStore = useMainStore();

const scale = 135;
const gridHeight = computed(() => mainStore.samParams.MAX_DISTANCE / scale);
const gridWidth = 610;
</script>