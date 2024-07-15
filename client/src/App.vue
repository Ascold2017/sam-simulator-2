<template>
  <v-layout full-height>
    <v-main dark>
      
      <RouterView />
      <!--
      <v-dialog v-model="mainStore.isShowResults" persistent>
        <v-list dencity="compact">
          <v-list-item v-for="log in mainStore.logs" :title="log.message" :subtitle="new Date(log.time).toString()" />
        </v-list>
      </v-dialog>
      -->
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMissionEditorStore } from './store/missionEditor';
import { useSamSettings } from './store/sam/settings';

const samSettings = useSamSettings();
const missionEditorStore = useMissionEditorStore()

onMounted(() => {
  samSettings.getSamSettings();
  missionEditorStore.getFlightObjectTypes();
  missionEditorStore.getMissions();
})
</script>

<style>
.custom-background {
  background-size: auto;
  background-repeat: repeat;
  background-image: url(@/assets/background.jpg);
}
</style>