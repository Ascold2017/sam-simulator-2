<template>
    <v-layer>
        <v-group :x="canvasSize / 2" :y="canvasSize / 2">
            <v-line :points="[0, 0, outerRadius, 0]" stroke="green" strokeWidth="1" :rotation="rotation - 90" />
        </v-group>
    </v-layer>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Konva from 'konva';

const props = defineProps<{
    canvasSize: number;
    padding: number;
    updateTime: number;
    isEnabled: boolean;
}>();

const outerRadius = props.canvasSize / 2 - props.padding;
const rotation = ref(0);
let animation: Konva.Animation | null = null;

const startRotation = () => {
    const layer = Konva.stages[0].find('Layer')[0];

    animation = new Konva.Animation((frame) => {
        if (frame) {
            const anglePerSecond = 360 / props.updateTime;
            rotation.value = (rotation.value + anglePerSecond * (frame.timeDiff / 1000)) % 360;
            layer.draw();
        }
    }, layer);

    animation.start();
};

const stopRotation = () => {
    if (animation) {
        animation.stop();
        animation = null;
    }
};

watch(
    () => props.isEnabled,
    (newVal) => {
        if (newVal) {
            rotation.value = 0;
            startRotation();
        } else {
            stopRotation();
            rotation.value = 0;
        }
    }
);

onMounted(() => {
    if (props.isEnabled) {
        startRotation();
    }
});

onBeforeUnmount(() => {
    stopRotation();
});
</script>