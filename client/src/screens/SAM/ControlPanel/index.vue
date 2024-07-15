<template>
<vk-stage :config="{ width: 300, height: 660 }">
    <vk-layer>
        <Panel />
    </vk-layer>
    </vk-stage>
</template>

<script setup lang="ts">
import Panel from './Panel.vue'
</script>