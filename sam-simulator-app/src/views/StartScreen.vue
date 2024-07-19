<template>
  <div class="start-screen">
      <h1 class="start-screen__title">SAM Simulator</h1>

      <div class="start-screen__content">
        <h2 class="start-screen__subtitle">Миссии</h2>
        <ul class="start-screen__mission-list">
          <li v-for="mission in missionStore.missions" :key="mission.id" @click="launchMission(mission.id)"
            class="start-screen__mission-item">
            <img src="https://via.placeholder.com/150" alt="Mission Image" class="start-screen__mission-image"/>
            <span class="start-screen__mission-name">{{ mission.name }}</span>
          </li>
        </ul>

        <router-link to="/mission-editor"
          class="start-screen__link">
          Редактор миссий
        </router-link>
      </div>
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

<style scoped>
.start-screen {
 @apply flex flex-col items-center justify-center h-full;
}

.start-screen__title {
  @apply text-4xl font-bold text-white mb-8;
}

.start-screen__content {
  @apply bg-white bg-opacity-75 rounded-lg shadow-lg p-6 w-3/4 lg:w-1/2;
}

.start-screen__subtitle {
  @apply text-2xl font-semibold mb-4;
}

.start-screen__mission-list {
  @apply list-none p-0;
}

.start-screen__mission-item {
  @apply flex items-center p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-200;
}

.start-screen__mission-image {
  @apply w-16 h-16 mr-4;
}

.start-screen__mission-name {
  @apply text-lg;
}


.start-screen__link {
  @apply mt-6 inline-block text-blue-500 hover:text-blue-700;
}
</style>