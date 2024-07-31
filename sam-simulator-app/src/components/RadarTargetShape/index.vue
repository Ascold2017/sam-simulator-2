<template>
    <v-stage ref="stage" :config="stageConfig" class="target-canvas">
        <v-layer>
            <v-rect v-for="(value, index) in signature" :key="index" :x="index * (rectWidth + gap)"
                :y="canvasHeight - value * canvasHeight" :width="rectWidth" :height="value * canvasHeight"
                fill="green" />
        </v-layer>
    </v-stage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{ signature: number[] }>()
const canvasWidth = 140;
const canvasHeight = 60
const gap = 0.5
const stageConfig = ref({
    width: canvasWidth, // Ширина канваса
    height: canvasHeight, // Высота канваса
});

const rectWidth = computed(() => (canvasWidth - (props.signature.length - 1) * gap) / props.signature.length);

</script>