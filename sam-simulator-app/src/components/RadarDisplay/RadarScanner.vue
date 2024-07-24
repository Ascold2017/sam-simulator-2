<template>
    <v-layer>
        <v-group :x="canvasSize / 2" :y="canvasSize / 2">
            <v-line :points="[0, 0, outerRadius, 0]" stroke="green" strokeWidth="1" :rotation="cursorAngle" />
        </v-group>
    </v-layer>
</template>

<script setup lang="ts">

const props = defineProps<{
    canvasSize: number;
    padding: number;
    cursorAngle: number;
}>();

const outerRadius = props.canvasSize / 2 - props.padding;
</script>