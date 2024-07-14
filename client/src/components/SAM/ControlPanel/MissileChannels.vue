<template>
    <vk-group :config="{ x: 20, y: 205 }">
        <vk-line :config="{ points: [0, 0, 255, 0], stroke: '#181818', strokeWidth: 2, shadowBlur: 5 }" />
        <vk-text :config="{
            x: 100, y: 10,
            text: 'MISSILES',
            fill: '#181818',
            fontFamily: 'DS-DigitalB',
            fontSize: 14,
            textAlign: 'center',
            width: 100
        }" />

        <vk-group :config="{ x: 0, y: 35 }">
            <vk-circle v-for="i in samSettings.samParams.MISSILES_COUNT" :config="{
                x: 42 * i - 20,
                y: 10,
                width: 20,
                height: 20,
                fill: weaponStore.missilesLeft >= i ? 'rgb(150, 249, 123)' : 'red',
                shadowBlur: 5
            }" />
        </vk-group>

        <MissileChannel v-for="(missileChannel, i) in weaponStore.missileChannels" :index="i" :missileChannel="missileChannel" />
    </vk-group>
</template>

<script setup lang="ts">
import { useWeaponStore } from '@/store/sam/weapon';
import MissileChannel from './MissileChannel.vue'
import { useSamSettings } from '@/store/sam/settings';

const samSettings = useSamSettings()
const weaponStore = useWeaponStore()

</script>

