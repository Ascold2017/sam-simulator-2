<template>
  <div class="panel" v-if="radar">
    <div class="panel-display">
      <RadarDisplay :radar="radar" :radar-objects="radarObjects" :cursor-angle="cursorAngle" :map-image="gameStore.currentMission.map1024"/>
      <RadarTargets :radarObjects="radarObjects" />
    </div>
    <div class="panel-buttons">
      <button class="action-button" :class="{ 'action-button--active': radar?.isEnabled }" @click="setRadarEnabled(true)">ON</button>
      <button class="action-button" :class="{ 'action-button--active': !radar?.isEnabled }" @click="setRadarEnabled(false)">OFF</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import RadarTargets from './RadarTargets.vue'
import RadarDisplay from '@/components/RadarDisplay/index.vue'
import { computed, onMounted, watch } from 'vue';
import { useGameStore } from '@/stores/game';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const gameStore = useGameStore()

const radarGameId = computed(() => route.params.radarGameId as string)
const radar = computed(() => gameStore.radars.find(r => r.gameId === radarGameId.value));
const radarObjects = computed(() =>gameStore.radarObjectsByRadarIds[radarGameId.value] || [])
const cursorAngle = computed(() => gameStore.cursorAnglesByRadarIds[radarGameId.value] || 0)

onMounted(() => {
  if (!gameStore.isInitialized) {
    router.push({ name: 'gameMap' })
  }
})
function setRadarEnabled(value: boolean) {
  gameStore.setEnableRadar(radarGameId.value, value)
}
</script>

<style scoped>
.mission-radar {
  @apply flex flex-row p-6 bg-neutral-900 rounded-lg shadow-lg;
  @apply w-[max-content] mx-auto;
  /* Добавление фиксированной ширины и центрирование */
}

.mission-radar__display-container {
  @apply relative w-[500px] h-[500px] bg-black rounded-lg;
  box-shadow: inset 0 0 5px white;
}

.mission-radar__button-bar {
  @apply flex flex-col ml-4 space-y-2;
}
</style>