<template>
    <vk-group :config="{ x: 20, y: 100 }">
        <vk-line :config="{ points: [0, 0, 255, 0], stroke: '#181818', strokeWidth: 2, shadowBlur: 5 }" />
        <vk-text :config="{
            x: 80, y: 10,
            text: 'SELECT TARGET',
            fill: '#181818',
            fontFamily: 'DS-DigitalB',
            fontSize: 14,
            textAlign: 'center',
            width: 150
        }" />
        <SAMButton label="SEEK" :x="0" :y="30" name="seekTarget" @click="targetsStore.seekTarget" :value="false" />
        <SAMButton label="SLCT" :x="65" :y="30" name="selectTarget" @click="targetsStore.selectTarget" :value="false" />
        <SAMButton label="UNSLCT" :x="130" :y="30" name="uselectTarget" @click="targetsStore.unselectTarget" :value="false" />
        <SAMButton label="RST" :x="195" :y="30" name="resetTargets" @click="targetsStore.resetTargets" :value="false" />
    </vk-group>
</template>

<script setup lang="ts">
import { useTargets } from '@/store/sam/targets';
import SAMButton from '../SAMButton.vue';

const targetsStore = useTargets()
</script>