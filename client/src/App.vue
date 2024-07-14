<template>
  <v-layout full-height>
    <v-main dark>
      <SAMScreen v-show="activeScreen === 'SAM'" />
      <!--
      <v-dialog v-model="mainStore.isShowResults" persistent>
        <v-list dencity="compact">
          <v-list-item v-for="log in mainStore.logs" :title="log.message" :subtitle="new Date(log.time).toString()" />
        </v-list>
      </v-dialog>
      -->
      <AppMenu @open-screen="openScreen" />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppMenu from '@/components/AppMenu.vue'
import SAMScreen from '@/components/SAM/SAM.vue';
// import EditorScreen from '@/components/Editor/EditorScreen.vue'
import { useMissionEditorStore } from './store/missionEditor';
import { useSamSettings } from './store/sam/settings';

const samSettings = useSamSettings();
const missionEditorStore = useMissionEditorStore()
enum ScreensEnum {
  SAM = 'SAM',
  Editor = 'Editor',
  Results = 'Results'
}

const activeScreen = ref(ScreensEnum.SAM);
const openScreen = (screen: string) => {
  activeScreen.value = screen as ScreensEnum;
}

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