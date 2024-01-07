<template>
    <div style="cursor: crosshair;">
        <vk-stage :config="{ width: 600, height: 600, }">
            <vk-layer>
                <vk-image :config="{ image: img, width: 600, height: 600 }" @click="onClickMap" />
                <vk-line v-for="(canvasTask, i) in canvasTasks" :config="{
                    points: canvasTask.points,
                    stroke: missionEditorStore.selectedTask.id === canvasTask.id ? 'red' : 'white',
                    strokeWidth: 3
                }" @click="missionEditorStore.selectTask(canvasTask.id!)" @mouseenter="handleCursor($event, i, 'line')"
                    @mouseleave="handleCursor($event, i, 'line')" />
                <vk-circle v-if="missionEditorStore.selectedPointIndex !== null" :config="{
                    x: selectedCanvasPoint.x,
                    y: selectedCanvasPoint.y,
                    radius: 5,
                    fill: 'white',
                }" />
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
                    fontFamily: 'Russo One, sans-serif',
                    fill: missionEditorStore.selectedPointIndex === i ? 'red' : 'black'
                }" @click="missionEditorStore.selectPoint(i)" @mouseenter="handleCursor($event, i, 'label')"
                    @mouseleave="handleCursor($event, i, 'label')" />

            </vk-layer>
        </vk-stage>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useMissionEditorStore, type ITask } from '@/store/missionEditor';
import { computed } from 'vue';
import mapImage from '@/assets/map.png';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Shape } from 'konva/lib/Shape';
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
});

const selectedCanvasPoint = computed(() => {
    if (missionEditorStore.selectedPointIndex === null) return { x: 0, y: 0 };
    return {
        x: missionEditorStore.selectedPoint.x / scale / 2 + canvasCenter.x,
        y: missionEditorStore.selectedPoint.y / scale / 2 + canvasCenter.y,
    }
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

const handleCursor = (e: KonvaEventObject<MouseEvent>, index: number, type: 'line' | 'label') => {
    const stage = e.target.getStage();
    const target = e.target as Shape;
    if (stage) {
        if (e.type === "mouseenter") {
            if (type === 'label') target.fill('white');
            if (type === 'line') return;
        } else {
            if (type === 'label') target.fill(missionEditorStore.selectedPointIndex === index ? 'red' : 'black');
            if (type === 'line') return;
        }
    }
};
</script>