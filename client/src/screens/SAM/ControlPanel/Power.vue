<template>
    <vk-group :config="{ x: 20, y: 20 }">
        <vk-text :config="{
            x: 0,
            y: 20,
            height: 20,
            verticalAlign: 'middle',
            text: 'POWER',
            fill: '#181818',
            fontFamily: 'DS-DigitalB, sans-serif',
            fontSize: 14
        }" />
        <vk-circle :config="{
            name: 'powerIndicator',
            x: 95,
            y: 30,
            width: 20,
            height: 20,
            fill: supplyStore.isEnabled ? 'rgb(150, 249, 123)' : 'red',
            shadowBlur: 5
        }" />
        <SAMButton label="ON" :x="130" :y="0" name="powerOn" :value="!!supplyStore.isEnabled"
            @click="supplyStore.setIsEnabled(true)" />
        <SAMButton label="OFF" :x="195" :y="0" name="powerOff" :value="!supplyStore.isEnabled"
            @click="supplyStore.setIsEnabled(false)" />
    </vk-group>
</template>

<script setup lang="ts">
import { useSupplyStore } from '@/store/sam/supply';
import SAMButton from '../SAMButton.vue';

const supplyStore = useSupplyStore()
</script>