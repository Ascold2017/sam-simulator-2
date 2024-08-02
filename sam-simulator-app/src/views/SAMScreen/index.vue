<template>
  <section class="panel sam" v-if="sam">
    <div class="panel-display sam__display">
      <RadarDisplay :radarObjects="radarObjects" :radar="radarConfig!" :cursor-angle="cursorAngle"
        :map-image="gameStore.currentMission.map1024" :target-cursor-angle="targetCursor.azimuth" />
    </div>
    <div class="sam__power">
      <div class="panel-title">POWER</div>
      <button class="action-button" :class="{ 'action-button--active': sam.radar.isEnabled }"
        @click="setRadarEnabled(true)">ON</button>
      <button class="action-button" :class="{ 'action-button--active': !sam.radar.isEnabled }"
        @click="setRadarEnabled(false)">OFF</button>

      <div class="panel-title">CAPTURE</div>
      <button class="action-button" @click="captureTarget()">CAPT</button>
      <button class="action-button" @click="resetTarget()">RST</button>
    </div>
    <div class="sam__weapon">
      <div class="panel-title">MISSILES</div>
      <div class="panel-display">
        <span class="display-title">10</span>
      </div>

      <div class="panel-title">GUIDANCE</div>
      <div>
        <button class="action-button" :class="{ 'action-button--active': guidanceMethod === '3P' }"
          @click="guidanceMethod = '3P'">3P</button>
        <button class="action-button" :class="{ 'action-button--active': guidanceMethod === '1/2' }"
          @click="guidanceMethod = '1/2'">1/2</button>
      </div>

      <div class="panel-title">LAUNCHER</div>
      <div class="panel-indicator-block">READY <div class="panel-indicator"></div>
      </div>
      <div>
        <button class="action-button" @click="fireTarget">FIRE</button>
        <button class="action-button">RESET</button>
      </div>
    </div>
    <div class="panel-display sam__target-display">
      <TvDisplay :cursor="targetCursor" :radarObjects="radarObjects" @move-cursor="moveTargetCursor" />
    </div>


  </section>
</template>

<script setup lang="ts">
import { type EnvironmentRadar } from '@shared/models/game.model'
import RadarDisplay from '@/components/RadarDisplay/index.vue'
import TvDisplay from '@/components/TvDisplay/index.vue';
import { useGameStore } from '@/stores/game';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()

const gameStore = useGameStore()

const guidanceMethod = ref<'3P' | '1/2'>('3P')
const samId = computed(() => +route.params.samId)
const sam = computed(() => gameStore.sams.find(r => r.id === samId.value));

const radarObjects = computed(() => gameStore.radarObjectsByRadarIds[sam.value?.radar.gameId] || [])
const cursorAngle = computed(() => gameStore.cursorAnglesByRadarIds[sam.value?.radar.gameId] || 0)
const targetCursor = computed(() => gameStore.targetCursorsByWeaponIds[sam.value?.weapon.gameId] || { azimuth: 0, elevation: 0 })
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

function moveTargetCursor({ azimuth, elevation }: { azimuth: number; elevation: number }) {
  if (!sam.value) return
  gameStore.moveTargetCursor(sam.value.weapon.gameId, azimuth, elevation)
}

function captureTarget() {
  if (!sam.value) return
  gameStore.captureTarget(sam.value.weapon.gameId)
}

function resetTarget() {
  if (!sam.value) return
  gameStore.resetTarget(sam.value.weapon.gameId)
}

function fireTarget() {
  if (!sam.value) return;
  gameStore.fire(sam.value.weapon.gameId, guidanceMethod.value)
}
</script>

<style scoped>
.sam {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 16px;
  grid-template-areas: 'display power weapon target' 'display power weapon target';
}

.sam__display {
  grid-area: display;
}

.sam__power {
  grid-area: power;
}

.sam__weapon {
  grid-area: weapon;
}

.sam__target-display {
  grid-area: target;
}
</style>