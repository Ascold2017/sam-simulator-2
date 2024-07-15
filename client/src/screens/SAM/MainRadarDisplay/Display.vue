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
        <radar-grid v-if="isEnabled" :scale="scale" :gridHeight="gridHeight" :gridWidth="gridWidth" />
        <!-- targets -->
        <vk-group>
            <RadarIndicatorTarget v-for="radarObject in radarObjects" :scale="scale" :gridHeight="gridHeight"
                :gridWidth="gridWidth" :target="radarObject" />
            <RadarIndicatorInfo v-for="(targetObject, i) in detectedEnemies" :index="i"
                :config="{ x: 622, y: 20 }" :target="targetObject" />
        </vk-group>
    </vk-group>
</template>
  
<script setup lang="ts">
import RadarGrid from "./RadarGrid.vue";
import RadarIndicatorTarget from './RadarIndicatorTarget.vue';
import RadarIndicatorInfo from './RadarIndicatorInfo.vue';
import { computed } from 'vue';
import { useRadarObjects } from "@/store/sam/radarObjects";
import { useSamSettings } from "@/store/sam/settings";
import { useSupplyStore } from "@/store/sam/supply";
import { storeToRefs } from "pinia";

const supplyStore = useSupplyStore()
const radarObjectsStore = useRadarObjects()
const samSettings = useSamSettings()

const { isEnabled } = storeToRefs(supplyStore)
const { radarObjects, detectedEnemies } = storeToRefs(radarObjectsStore)

const scale = 135;
const gridHeight = computed(() => samSettings.samParams!.MAX_DISTANCE / scale);
const gridWidth = 610;
</script>