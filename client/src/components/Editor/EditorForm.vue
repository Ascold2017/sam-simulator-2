<template>
    <div class="d-flex flex-wrap align-content-start">
        <v-card class="mb-3 mr-3 flex-1-1" elevation="9" title="Edit task">

            <h3 class="mb-3 px-3">Put flight point and set target params</h3>
            <h4 class="mb-3 px-3">Flight distance: {{ flightParams.range }} km | Flight time: {{ flightParams.time
            }}
                min
            </h4>
            <v-select label="Flight object type" class="mx-3" :items="missionEditorStore.flightObjectTypes"
                item-title="name" item-value="id" :model-value="missionEditorStore.selectedTask.flightObjectTypeId"
                @update:model-value="missionEditorStore.selectedTask.flightObjectTypeId = $event" variant="outlined" />

            <v-text-field label="Starting for, s" class="mx-3" :model-value="missionEditorStore.selectedTask.delay"
                @update:model-value="missionEditorStore.selectedTask.delay = +$event" variant="outlined" />

            <div class="mb-3 mx-3 d-flex justify-space-between">
                <v-btn @click="missionEditorStore.saveTask"
                    :disabled="missionEditorStore.selectedTask.points.length < 2 || !missionEditorStore.selectedTask.flightObjectTypeId"
                    color="success">{{ missionEditorStore.selectedTask.id !== null ? 'Save task' : 'Add task' }}
                </v-btn>
                <v-btn @click="missionEditorStore.resetTask" color="warning">Reset</v-btn>
            </div>
        </v-card>
        <v-card :title="'Edit point: ' + missionEditorStore.selectedPointIndex" elevation="9" class="mb-3 flex-1-1">
            <h3 class="mb-3 px-3">Click point in list for select</h3>
            <v-text-field :model-value="missionEditorStore.selectedPoint.z"
                @update:model-value="missionEditorStore.setPointParam('z', $event)" label="Height, m" class="mx-3" variant="outlined" />
            <v-text-field :model-value="missionEditorStore.selectedPoint.v"
                @update:model-value="missionEditorStore.setPointParam('v', $event)" label="Velocity, m/s" class="mx-3" variant="outlined" />
        </v-card>
        <v-card title="Flight tasks" elevation="9" width="100%">
            <v-table density="compact" class="mb-3" max-height="300">
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
    </div>
</template>

<script setup lang="ts">
import { useMissionEditorStore } from '@/store/missionEditor';
import { computed } from 'vue';

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