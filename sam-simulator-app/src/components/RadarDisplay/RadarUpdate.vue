<template>
    <v-group x="25" y="25">
        <v-circle :x="0" :y="0" :radius="radius" :stroke="circleColor" :stroke-width="strokeWidth"
            :rotation="startAngle" :angle="progressAngle" />
        <v-text :x="-(textWidth / 2)" :y="-(textHeight / 2)" :width="textWidth" :height="textHeight"
            :text="remainingTime" :fontSize="fontSize" :fill="textColor" align="center" verticalAlign="middle" />
    </v-group>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
    updateTime: number;
    isEnabled: boolean;
}>();

const radius = 20;
const strokeWidth = 10;
const startAngle = -90;
const textWidth = 50;
const textHeight = 20;
const fontSize = 12;
const textColor = 'white';
const circleColor = 'green';

const progressAngle = ref(0);
const remainingTime = ref(props.updateTime);

let intervalId: number | null = null;

const updateProgress = () => {
    if (remainingTime.value > 0) {
        remainingTime.value -= 1;
        progressAngle.value = ((props.updateTime - remainingTime.value) / props.updateTime) * 360;
    } else {
        remainingTime.value = props.updateTime;
        progressAngle.value = 0;
    }
};

const startTimer = () => {
    intervalId = setInterval(updateProgress, 1000);
};

const stopTimer = () => {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

watch(
    () => props.isEnabled,
    (newVal) => {
        if (newVal) {
            remainingTime.value = props.updateTime;
            progressAngle.value = 0;
            startTimer();
        } else {
            stopTimer();
            remainingTime.value = props.updateTime;
            progressAngle.value = 0;
        }
    }
);

onMounted(() => {
    if (props.isEnabled) {
        startTimer();
    }
});

onBeforeUnmount(() => {
    stopTimer();
});
</script>
