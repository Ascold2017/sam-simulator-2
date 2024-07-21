<template>
    <div class="mission-sam">
        <MissionRadar :radar="sam.radar" />
    </div>
</template>

<script setup lang="ts">
import type { EnvironmentSAM } from '@shared/models/game.model'
import MissionRadar from '../MissionRadar/RadarContent.vue'
const props = defineProps<{
  sam: EnvironmentSAM;
}>();
</script>