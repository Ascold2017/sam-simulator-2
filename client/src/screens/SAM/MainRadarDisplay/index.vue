<template>
 <vk-stage :config="{ width: 860, height: 660 }">
        <vk-layer>
            <MainRadarPanel />
        </vk-layer>
        <vk-layer>
            <MainRadarDisplay />
        </vk-layer>
    </vk-stage>
</template>

<script setup lang="ts">
import MainRadarPanel from './MainRadarPanel.vue'
import MainRadarDisplay from './Display.vue'
</script>