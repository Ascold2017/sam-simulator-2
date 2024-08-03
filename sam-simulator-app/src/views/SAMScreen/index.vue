<template>
  <section class="panel sam" v-if="sam">
    <div class="panel-display sam__display">
      <RadarDisplay :radarObjects="radarObjects" :radar="radarConfig!" :cursor-angle="cursorAngle"
        :map-image="gameStore.currentMission.map1024" :target-cursor-angle="targetCursor.azimuth" />
    </div>
    <div class="sam__power">
      <div class="panel-title">POWER</div>
      <button class="action-button" :class="{ 'action-button--active': isEnabledRadar }"
        @click="setRadarEnabled(true)">ON</button>
      <button class="action-button" :class="{ 'action-button--active': !isEnabledRadar }"
        @click="setRadarEnabled(false)">OFF</button>

      <div class="panel-title">CAPTURE</div>
      <button class="action-button" @click="captureTarget()">CAPT</button>
      <button class="action-button" @click="resetTarget()">RST</button>
    </div>
    <div class="sam__weapon">
      <div class="panel-title">MISSILES</div>
      <div class="panel-display">
        <span class="display-title">{{ ammoLeft }}</span>
      </div>

      <div class="panel-title">GUIDANCE</div>
      <div>
        <button class="action-button" :class="{ 'action-button--active': guidanceMethod === '3P' }"
          @click="guidanceMethod = '3P'">3P</button>
        <button class="action-button" :class="{ 'action-button--active': guidanceMethod === '1/2' }"
          @click="guidanceMethod = '1/2'">1/2</button>
          <button class="action-button" :class="{ 'action-button--active': guidanceMethod === '1' }"
          @click="guidanceMethod = '1'">1</button>
      </div>

      <div class="panel-title">LAUNCHER</div>
      <div class="panel-indicator-block">READY <div class="panel-indicator" :class="{ 'panel-indicator--active': isCaptured }"></div>
      </div>
      <div>
        <button class="action-button" @click="fireTarget">FIRE</button>
        <button class="action-button">RESET</button>
      </div>
    </div>
    <div class="panel-display sam__target-display">
      <TvDisplay :cursor="targetCursor" :angle-of-view="sam.weapon.angleOfView" :targetObjects="targetObjects" @move-cursor="moveTargetCursor" />
    </div>


  </section>
</template>

<script setup lang="ts">
import { type EnvironmentRadar } from '@shared/models/game.model'
import RadarDisplay from '@/components/RadarDisplay/index.vue'
import TvDisplay from '@/components/TvDisplay/index.vue';
import { useGameStore } from '@/stores/game';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()

const gameStore = useGameStore()

const guidanceMethod = ref<'3P' | '1/2' | '1'>('3P')
const samId = computed(() => +route.params.samId)
const sam = computed(() => gameStore.sams.find(r => r.id === samId.value));

const radarUpdate = computed(() => {
  if (!sam.value) return null
  return gameStore.radarUpdateByIds[sam.value.radar.gameId] || null
})
const radarObjects = computed(() => radarUpdate.value?.radarObjects || [])
const cursorAngle = computed(() => radarUpdate.value?.cursorAngle || 0)
const isEnabledRadar = computed(() => radarUpdate.value?.enabled);

const weaponUpdate = computed(() => {
  if (!sam.value) return null
  return gameStore.weaponUpdateByIds[sam.value.weapon.gameId] || null
})

const targetObjects = computed(() => weaponUpdate.value?.targetObjects || [])
const targetCursor = computed(() => ({ azimuth: weaponUpdate.value?.cursorAzimuth || 0, elevation: weaponUpdate.value?.cursorElevation || 0 }))
const isCaptured = computed(() => !!weaponUpdate.value?.capturedTargetId)
const ammoLeft = computed(() => weaponUpdate.value?.ammoLeft || 0)
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

watch(radarUpdate, (v) => {})
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