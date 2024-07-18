import { httpClient } from "@/adapters/httpClient";
import { socketClient } from "@/adapters/socketClient";
import type { Mission } from "@/models/mission.model";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMissionStore = defineStore('mission', () => {

    const missions = ref<Mission[]>([])

    async function getMissions() {
        const data = await httpClient.request<undefined, Mission[]>({ url: '/missions', method: 'GET' })
        missions.value = data;
    }

    function launchMission(missionId: number) {
        socketClient.send('loadMission', { id: missionId })
    }

    return {
        missions,
        getMissions,
        launchMission
    }
})