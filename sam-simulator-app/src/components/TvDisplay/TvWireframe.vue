<template>
    <v-layer>
        <v-group>

            <v-text :text="azimuthDeg.toFixed(1)" fill="white" :x="canvasSize / 2" :y="3" :offsetX="25" :width="50"
                align="center"></v-text>
            <v-text :text="elevationDeg.toFixed(1)" fill="white" :x="3" :y="canvasSize / 2 + 3"></v-text>
            <!-- Горизонтальная линия перекрестия -->
            <v-line :config="{
                points: [0, canvasSize / 2, canvasSize / 2 - 10, canvasSize / 2],
                stroke: 'white',
                strokeWidth: 1
            }"></v-line>
            <v-line :config="{
                points: [canvasSize / 2 + 10, canvasSize / 2, canvasSize, canvasSize / 2],
                stroke: 'white',
                strokeWidth: 1
            }"></v-line>

            <!-- Вертикальная линия перекрестия -->
            <v-line :config="{
                points: [canvasSize / 2, 0, canvasSize / 2, canvasSize / 2 - 10],
                stroke: 'white',
                strokeWidth: 1
            }"></v-line>
            <v-line :config="{
                points: [canvasSize / 2, canvasSize / 2 + 10, canvasSize / 2, canvasSize],
                stroke: 'white',
                strokeWidth: 1
            }"></v-line>
        </v-group>
    </v-layer>
</template>


<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ canvasSize: number; cursor: { azimuth: number; elevation: number } }>()

const azimuthDeg = computed(() => props.cursor.azimuth * (180 / Math.PI))
const elevationDeg = computed(() => props.cursor.elevation * (180 / Math.PI))
</script>