<template>
    <div class="panel">
        <div class="panel-display">
            <MapDisplay :radars="radars" :sams="sams" :mapSrc="currentMission.map1024" />
        </div>
        <div class="panel-buttons">
            <router-link v-for="radar in radars" class="action-button action-button--block"
                :to="{ name: 'radar', params: { radarGameId: radar.gameId } }">{{ radar.name }} -></router-link>
            <router-link v-for="sam in sams" class="action-button action-button--block"
                :to="{ name: 'sam', params: { samId: sam.id } }">{{ sam.name }} -></router-link>
            <button class="action-button action-button--block mt-auto" @click="gameStore.stopMission"><- END MISSION</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import MapDisplay from '@/components/MapDisplay/index.vue'
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { onMounted } from 'vue';

const gameStore = useGameStore()
const { currentMission, radars, sams } = storeToRefs(gameStore)

onMounted(() => {
    gameStore.getCurrentMission();
})
</script>