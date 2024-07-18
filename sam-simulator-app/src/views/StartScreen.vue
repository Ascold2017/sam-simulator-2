<template>
  <div >
    <h1>Start</h1>

    <ul>
      <li v-for="mission in missionStore.missions" :key="mission.id" @click="launchMission(mission.id)">{{ mission.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useMissionStore } from '@/stores/mission';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const missionStore = useMissionStore()

onMounted(() => {
  missionStore.getMissions();
})


function launchMission(missionId: number) {
  missionStore.launchMission(missionId)
  router.push({ name: 'game' })
}
</script>
