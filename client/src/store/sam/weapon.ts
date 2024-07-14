import type {
    IMissileChannel,
    SamLaunchMissilePayload,
    SamResetMissilePayload,
} from "@/model/sam.model";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useSupplyStore } from "./supply";
import { samHttpClient, samSocketClient } from "@/adapters/clients";
import Sounds from "@/helpers/sounds";
import { useTargets } from "./targets";

export const useWeaponStore = defineStore("sam/weapon", () => {
    const supplyStore = useSupplyStore();
    const targetsStore = useTargets();

    const missileChannels = ref<IMissileChannel[]>([]);
    const missilesLeft = ref(0);

    watch(() => supplyStore.isEnabled, (v) => {
        if (v) {
            subsribeUpdate();
        } else {
            missilesLeft.value = 0;
            missileChannels.value = [];
        }
    });

    function subsribeUpdate() {
        samSocketClient.listenToEvent(
            "MISSILE_CHANNELS_UPDATE",
            (payload: IMissileChannel[]) => {
                missileChannels.value = [...payload];
            },
        );

        samSocketClient.listenToEvent(
            "MISSILES_LEFT_UPDATE",
            (payload: number) => {
                missilesLeft.value = payload;
            },
        );
    }

    async function launchMissile(channelId: number, method: string) {
        try {
            await samHttpClient.request<SamLaunchMissilePayload, undefined>({
                method: "POST",
                path: "/launch-missile",
                payload: {
                    id: targetsStore.currentTargetId!,
                    channelId,
                    method,
                },
            });
            Sounds.missileStart();
        } catch (e: any) {
            console.log(e.message);
        }
    }

    async function resetMissile(channelId: number) {
        try {
            await samHttpClient.request<SamResetMissilePayload, undefined>({
                method: "POST",
                path: "/reset-missile",
                payload: {
                    channelId,
                },
            });
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return {
        missileChannels,
        missilesLeft,
        launchMissile,
        resetMissile,
    };
});
