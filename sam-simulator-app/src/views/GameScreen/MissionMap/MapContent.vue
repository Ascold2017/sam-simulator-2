<template>
    <div class="panel">
        <div class="panel-display">
            <MapDisplay :radars="radars" :sams="sams" :mapSrc="currentMission.map1024" :radarObjects="allRadarObjects"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import MapDisplay from '@/components/MapDisplay/index.vue'
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { computed } from 'vue';

const gameStore = useGameStore()
const { currentMission, radars, sams, allRadarObjects } = storeToRefs(gameStore)

</script>