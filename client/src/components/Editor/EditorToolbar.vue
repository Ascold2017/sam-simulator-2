<template>
    <v-toolbar>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Missions
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(mission, index) in missionEditorStore.missions" :key="index"
                    @click="missionEditorStore.selectMission(mission.id!)">
                    <v-list-item-title>{{ mission.name }}</v-list-item-title>
                </v-list-item>
                <v-list-item :key="'new'" @click="missionEditorStore.clearMission">
                    <v-list-item-title>New mission*</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-spacer />
        <v-text-field label="Mission name" :model-value="missionEditorStore.currentMission.name"
            @update:model-value="missionEditorStore.currentMission.name = $event" density="compact" variant="outlined"
            style="max-width: 250px;" hide-details class="mr-3" />
        <v-btn @click="missionEditorStore.saveMission" color="success">{{ missionEditorStore.currentMission.id !==
            null ? 'Update' : 'Create' }}</v-btn>
        <v-btn @click="missionEditorStore.resetMission" color="warning">Reset</v-btn>
    </v-toolbar>
</template>

<script setup lang="ts">
import { useMissionEditorStore } from '@/store/missionEditor';

const missionEditorStore = useMissionEditorStore();
</script>