<template>
  <div class="panel">
    <div class="panel-display">
      <RadarDisplay :radarObjects="radarObjects" :radar="radarConfig" :cursor-angle="cursorAngle"
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
import { computed } from 'vue';
const props = defineProps<{
  sam: EnvironmentSAM;
}>();

const gameStore = useGameStore()

const radarObjects = computed(() => gameStore.radarObjectsByRadarIds[props.sam.radar.gameId] || [])
const cursorAngle = computed(() => gameStore.cursorAnglesByRadarIds[props.sam.radar.gameId] || 0)
const radarConfig = computed<EnvironmentRadar>(() => ({
  ...props.sam.radar,
  id: props.sam.id,
  name: props.sam.name,
  position: props.sam.position
}))
function setRadarEnabled(value: boolean) {
  gameStore.setEnableRadar(props.sam.radar.gameId, value)
}
</script>

<style scoped></style>