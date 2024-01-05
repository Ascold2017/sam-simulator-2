<template>
    <vk-stage :config="{ width: 600, height: 660 }">
        <vk-layer>
            <vk-image :config="{ image: img, width: 600, height: 600 }" @click="onClickMap" />
            <vk-line v-for="canvasTask in canvasTasks"
                :config="{
                    points: canvasTask.points,
                    stroke: missionEditorStore.selectedTask.id === canvasTask.id ? 'red' : 'white',
                    strokeWidth: 3
                }"
                @click="missionEditorStore.selectTask(canvasTask.id!)" />
        </vk-layer>
        <vk-layer>
            <vk-text :config="{
                x: 10,
                y: 10,
                text: 'Flight object: ' + (missionEditorStore.selectedFlightObjectType?.name || 'None'),
                fontFamily: 'Russo One, sans-serif'
            }" />
            <vk-text :config="{ x: 10, y: 22, text: 'N | H, m | V, m/s', fontFamily: 'Russo One, sans-serif' }" />
            <vk-text v-for="(point, i) in missionEditorStore.selectedTask.points" :config="{
                x: 10,
                y: 12 * i + 34,
                text: `${i} | ${point.z} | ${point.v}`,
                fontFamily: 'Russo One, sans-serif'
            }" />

        </vk-layer>
    </vk-stage>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import mapImage from '@/const/mapImage';
import { useMissionEditorStore, type IPoint, type ITask } from '@/store/missionEditor';
import { computed } from 'vue';
const img = ref<HTMLImageElement | null>(null);
const canvasCenter = { x: 300, y: 300 };
const scale = 333;

const missionEditorStore = useMissionEditorStore();
onMounted(() => {
    const image = new window.Image();
    image.src = mapImage;
    image.onload = () => {
        img.value = image;
    };
});

const canvasTasks = computed(() => {

    const handleTask = (task: ITask) => ({
        id: task.id,
        points: task.points.reduce<number[]>((acc, point) => {
            return [
                ...acc,
                point.x / scale / 2 + canvasCenter.x,
                point.y / scale / 2 + canvasCenter.y,
            ]
        }, [])
    });
    return [
        handleTask(missionEditorStore.selectedTask),
        ...missionEditorStore.currentMission.tasks.map(handleTask)
    ];
})

function onClickMap(event: any) {
    const canvasPoint = { x: event.evt.offsetX, y: event.evt.offsetY };
    const currentPoint = {
        x: (canvasPoint.x - canvasCenter.x) * scale * 2,
        y: (canvasPoint.y - canvasCenter.y) * scale * 2,
        z: missionEditorStore.selectedFlightObjectType?.altitude || 500,
        v: missionEditorStore.selectedFlightObjectType?.maxVelocity || 200
    };

    missionEditorStore.addPoint(currentPoint);
}
</script>