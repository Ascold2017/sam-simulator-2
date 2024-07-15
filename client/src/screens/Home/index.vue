<template>
  <v-card class="px-3 py-3">
    <div class="d-flex">
      <v-btn variant="text" v-for="mission in missionEditorStore.missions" @click="loadMission(mission.id!)">{{
        mission.name }}</v-btn>
        <v-spacer />
        <v-divider vertical />
      <v-btn variant="text" :to="{ name: 'editor' }">Mission editor</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useMissionEditorStore } from '@/store/missionEditor';
import { useRouter } from 'vue-router';

const router = useRouter()
const missionEditorStore = useMissionEditorStore();

function loadMission(missionId: number) {
  missionEditorStore.startMission(missionId)
  router.push({ name: 'sam' })
}
</script>