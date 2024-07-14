import { samHttpClient } from "@/adapters/clients";
import type { SamSettingsResponse } from "@/model/sam.model";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWeaponStore } from "./weapon";

export const useSamSettings = defineStore("sam/settings", () => {
    const weaponStore = useWeaponStore();
    const samParams = ref<SamSettingsResponse>({
        MAX_DISTANCE: 0,
        MIN_CAPTURE_RANGE: 0,
        MAX_CAPTURE_RANGE: 0,
        MISSILE_MAX_DISTANCE: 0,
        MISSILES_COUNT: 0,
        MISSILE_VELOCITY: 0,
        RADAR_AZIMUT_DETECT_ACCURACY: 0,
        RADAR_ELEVATION_DETECT_ACCURACY: 0,

        RADAR_DISTANCE_DETECT_ACCURACY: 0,
        MISSILES_CHANNEL_COUNT: 0,
    });

    async function getSamSettings() {
        try {
            const data = await samHttpClient.request<
                undefined,
                SamSettingsResponse
            >({
                method: "GET",
                path: "/settings",
            });
            weaponStore.missileChannels = Array.from(
                Array(data["MISSILES_CHANNEL_COUNT"]),
            )
                .map((_, index) => ({ id: index, isBusy: true }));
            samParams.value = data;
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return {
        samParams,
        getSamSettings,
    };
});
