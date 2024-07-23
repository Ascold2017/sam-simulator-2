import { httpClient } from "@/adapters/httpClient";

import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { Mission } from '@shared/models/missions.model'
import type { GetCurrentMissionResponse, EnvironmentRadar, EnvironmentSAM, RadarUpdateResponse, RadarObjectResponse, PostRadarEnabledPayload } from '@shared/models/game.model'
import { socketClient } from "@/adapters/socketClient";

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
    const radarsEnabled = ref<Record<string, boolean>>({})
    const radarObjectsByRadarIds = ref<Record<string, RadarObjectResponse[]>>({})

    socketClient.listenToEvent<RadarUpdateResponse>('radarUpdates', (data) => {
        radarObjectsByRadarIds.value = {
            ...radarObjectsByRadarIds.value,
            [data.radarId]: data.radarObjects
        }
    })

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

    async function setEnableRadar(radarGameId: string, value: boolean) {
        try {
            await httpClient.request<PostRadarEnabledPayload, undefined>({
                url: "/game/radar-enabled",
                method: "POST",
                payload: {
                    radarGameId,
                    value
                }
            });

            radarObjectsByRadarIds.value[radarGameId] = []
            radarsEnabled.value = {
                ...radarsEnabled.value,
                [radarGameId]: value
            }
        } catch (e) {
            console.error(e);
        }
    }

    return {
        radarsEnabled,
        radarObjectsByRadarIds,
        currentMission,
        isLoadingMission,
        radars,
        sams,
        launchMission,
        getCurrentMission,
        setEnableRadar
    };
});
