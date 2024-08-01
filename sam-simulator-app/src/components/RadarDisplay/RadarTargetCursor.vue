<template>
    <v-layer>
        <v-group :x="canvasSize / 2" :y="canvasSize / 2">
            <v-line :points="[0, 0, outerRadius, 0]" stroke="red" :strokeWidth="1" :rotation="targetCursorAngle * (180/Math.PI)" />
        </v-group>
    </v-layer>
</template>

<script setup lang="ts">

const props = defineProps<{
    canvasSize: number;
    padding: number;
    targetCursorAngle: number;
}>();

const outerRadius = props.canvasSize / 2 - props.padding;
</script>