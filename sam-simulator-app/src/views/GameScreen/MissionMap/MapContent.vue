<template>
    <div class="panel">
        <div class="panel-display">
            <MapDisplay :radars="radars" :sams="sams" :mapSrc="currentMission.map1024" />
        </div>
    </div>
</template>

<script setup lang="ts">
import MapDisplay from '@/components/MapDisplay/index.vue'
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore()
const { currentMission, radars, sams } = storeToRefs(gameStore)
</script>