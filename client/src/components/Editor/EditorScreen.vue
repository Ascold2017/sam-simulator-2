<template>
  <v-container class="mb-6" fluid>
    <v-card flat>
      <v-card-text>
        <div class="d-flex">
          <EditorMap />
          <v-divider vertical class="mx-3" />

          <div>
            <v-card class="mb-3" elevation="9">
              <v-card-title class="d-flex">
                Missions
                <v-spacer />
                <v-btn color="success" @click="missionEditorStore.clearMission">New</v-btn>
              </v-card-title>

              <v-table density="compact">
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Tasks count</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="mission in missionEditorStore.missions"
                    @click="missionEditorStore.selectMission(mission.id!)">
                    <td>{{ mission.name }}</td>
                    <td>{{ mission.tasks.length }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
            <v-card title="Current flight task" class="mb-3" elevation="9">
              <h3 class="mb-3 px-3">Put flight point and set target params</h3>
              <v-select label="Flight object type" class="mx-3" :items="missionEditorStore.flightObjectTypes"
                item-title="name" item-value="id" :model-value="missionEditorStore.selectedTask.flightObjectTypeId"
                @update:model-value="missionEditorStore.selectedTask.flightObjectTypeId = $event" />

              <v-text-field label="Starting for, s" class="mx-3" :model-value="missionEditorStore.selectedTask.delay"
                @update:model-value="missionEditorStore.selectedTask.delay = +$event" />
              <h4 class="mb-3 px-3">Way | Flight distance: {{ flightParams.range }} km | Flight time: {{ flightParams.time
              }}
                min
              </h4>
              <div class="mb-3 mx-3 d-flex justify-space-between">
                <v-btn @click="missionEditorStore.saveTask" :disabled="missionEditorStore.selectedTask.points.length < 2"
                  color="success">{{ missionEditorStore.selectedTask.id !== null ? 'Save task' : 'Add task' }}
                </v-btn>
                <v-btn @click="missionEditorStore.resetTask" color="warning">Reset</v-btn>
              </div>
            </v-card>
            <v-card title="Flight tasks" elevation="9" class="mb-3">
              <v-table density="compact" class="mb-3">
                <thead>
                  <tr>
                    <td>N</td>
                    <td>Flight object type</td>
                    <td>Starting for, s</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in missionEditorStore.currentMission.tasks"
                    @click="missionEditorStore.selectTask(task.id!)">
                    <td>{{ task.id }}</td>
                    <td>{{ task.flightObjectTypeId || 'None' }}</td>
                    <td>{{ task.delay }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <v-card elevation="9" class="px-3 py-3">
              <v-text-field label="Mission name" :model-value="missionEditorStore.currentMission.name"
                  @update:model-value="missionEditorStore.currentMission.name = $event" />
              <div class="d-flex justify-space-between">
                
                <v-btn @click="missionEditorStore.saveMission" color="success">{{ missionEditorStore.currentMission.id !== null ? 'Update mission' : 'Create mission' }}</v-btn>
                <v-btn @click="missionEditorStore.resetMission" color="warning">Reset mission</v-btn>
              </div>
            </v-card>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import EditorMap from './EditorMap.vue';
import { useMainStore } from '@/store/main';
import { useMissionEditorStore } from '@/store/missionEditor';
import { onMounted, ref, inject, computed } from 'vue';

const mainStore = useMainStore();
const missionEditorStore = useMissionEditorStore();

const flightParams = computed(() => {
  const range = missionEditorStore.selectedTask.points.reduce((acc, point, index, points) => {
    const prevPoint = index === 0 ? point : points[index - 1];
    const length = Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y);
    return acc + length;
  }, 0) / 1000;
  const time = missionEditorStore.selectedTask.points.reduce((acc, point, index, points) => {
    const prevPoint = index === 0 ? point : points[index - 1];
    const length = Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y);
    const time = (length / prevPoint.v) / 60;
    return acc + time;
  }, 0);
  return {
    range: range.toFixed(1),
    time: time.toFixed(1)
  }
})

</script>