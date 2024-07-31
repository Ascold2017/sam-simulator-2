<template>
  <div class="sam">
    <section class="panel" v-if="sam">
      <div class="panel-display">
        <RadarDisplay :radarObjects="radarObjects" :radar="radarConfig!" :cursor-angle="cursorAngle"
          :map-image="gameStore.currentMission.map1024" />
        <SAMTargets :radarObjects="radarObjects" />
      </div>
      <div class="panel-buttons">
        <div class="panel-title">RADAR</div>
        <button class="action-button" :class="{ 'action-button--active': sam.radar.isEnabled }"
          @click="setRadarEnabled(true)">ON</button>
        <button class="action-button" :class="{ 'action-button--active': !sam.radar.isEnabled }"
          @click="setRadarEnabled(false)">OFF</button>

        <div class="panel-title">TARGET</div>
        <button class="action-button">SEEK</button>
        <button class="action-button">SLCT</button>
        <button class="action-button">RST</button>
      </div>
      <div class="panel-buttons">
        <div class="panel-title">MISSILES</div>
        <div class="panel-display">
          <span class="display-title">10</span>
        </div>
        
        <div class="panel-title">GUIDANCE</div>
        <div>
          <button class="action-button">3T</button>
          <button class="action-button">1/2</button>
        </div>

        <div class="panel-title">LAUNCHER</div>
        <div class="panel-indicator-block">READY <div class="panel-indicator"></div></div>
        <div>
          <button class="action-button">LAUNCH</button>
          <button class="action-button">RESET</button>
        </div>

        
      </div>
    </section>
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

<style scoped>
.sam {
  @apply flex gap-2 mx-auto justify-center;
}

.sam>.panel {
  margin: 0;
}
</style>