<template>
    <div class="d-flex ga-4 justify-center align-center py-6">
        <MainRadar />
        <ControlPanel />
    </div>
</template>

<script setup lang="ts">
import MainRadar from './MainRadarDisplay/index.vue';
import ControlPanel from './ControlPanel/index.vue';

</script>