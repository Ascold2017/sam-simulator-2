import { httpClient } from "@/adapters/httpClient";

import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { Mission } from '@shared/models/missions.model'
import type { GetCurrentMissionResponse, EnvironmentRadar, EnvironmentSAM } from '@shared/models/game.model'

export const useGameStore = defineStore("game", () => {
    const router = useRouter();

    const isLoadingMission = ref(false);
    const currentMission = ref<Mission>({
        id: 0,
        name: "",
        map1024: "",
        map256: "",
    });
    const radars = ref<EnvironmentRadar[]>([]);
    const sams = ref<EnvironmentSAM[]>([]);

    async function launchMission(missionId: number) {
        try {
            isLoadingMission.value = true;
            await httpClient.request<undefined, undefined>({
                url: "/game/launch-mission/" + missionId,
                method: "POST",
            });
            isLoadingMission.value = false;
            router.push({ name: "game" });
        } catch (e) {
            console.error(e);
        }
    }

    async function getCurrentMission() {
        try {
            const data = await httpClient.request<undefined, GetCurrentMissionResponse>({
                url: "/game/current-mission",
                method: "GET",
            });

            currentMission.value = data.mission;
            radars.value = data.radars;
            sams.value = data.sams;
        } catch(e) {
            router.push({ name: "start" });
        }
        
    }

    return {
        currentMission,
        isLoadingMission,
        radars,
        sams,
        launchMission,
        getCurrentMission
    };
});
