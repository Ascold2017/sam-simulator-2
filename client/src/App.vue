<template>
  <v-layout full-height>
    <v-main dark>
      <SAMScreen v-show="activeScreen === 'SAM'" />
      <EditorScreen v-show="activeScreen === 'Editor'" />
      <AppMenu @open-screen="openScreen" />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppMenu from '@/components/AppMenu.vue'
import SAMScreen from '@/components/SAM/SAM.vue';
import EditorScreen from '@/components/Editor/EditorScreen.vue'
import { useMainStore } from './store/main';
import { useMissionEditorStore } from './store/missionEditor';

const mainStore = useMainStore();
const missionEditorStore = useMissionEditorStore()
enum ScreensEnum {
  SAM = 'SAM',
  Editor = 'Editor'
}

const activeScreen = ref(ScreensEnum.SAM);
const openScreen = (screen: string) => activeScreen.value = screen as ScreensEnum;

onMounted(() => {
  mainStore.getSamSettings();
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