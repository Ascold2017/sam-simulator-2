<template>
  <div class="panel" v-if="sam">
    <div class="panel-display">
      <RadarDisplay :radarObjects="radarObjects" :radar="radarConfig!" :cursor-angle="cursorAngle"
        :map-image="gameStore.currentMission.map1024" />
      <SAMTargets :radarObjects="radarObjects" />
    </div>
    <div class="panel-buttons">
      <button class="action-button" :class="{ 'action-button--active': sam.radar.isEnabled }"
        @click="setRadarEnabled(true)">ON</button>
      <button class="action-button" :class="{ 'action-button--active': !sam.radar.isEnabled }"
        @click="setRadarEnabled(false)">OFF</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type EnvironmentRadar, type EnvironmentSAM } from '@shared/models/game.model'
import RadarDisplay from '@/components/RadarDisplay/index.vue'
import SAMTargets from './SAMTargets.vue';
import { useGameStore } from '@/stores/game';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()

const gameStore = useGameStore()

const samId = computed(() => +route.params.samId)
const sam = computed(() => gameStore.sams.find(r => r.id === samId.value));

const radarObjects = computed(() => gameStore.radarObjectsByRadarIds[sam.value?.radar.gameId] || [])
const cursorAngle = computed(() => gameStore.cursorAnglesByRadarIds[sam.value?.radar.gameId] || 0)
const radarConfig = computed<EnvironmentRadar | null>(() => sam.value ? ({
  ...sam.value?.radar,
  id: sam.value?.id,
  name: sam.value?.name,
  position: sam.value?.position
}) : null);

onMounted(() => {
  if (!gameStore.isInitialized) {
    router.push({ name: 'gameMap' })
  }
})

function setRadarEnabled(value: boolean) {
  if (!sam.value) return
  gameStore.setEnableRadar(sam.value.radar.gameId, value)
}
</script>

<style scoped></style>