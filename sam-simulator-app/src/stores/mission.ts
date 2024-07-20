import { httpClient } from "@/adapters/httpClient";
import { socketClient } from "@/adapters/socketClient";
import type { LoadMissionResponse, Mission } from "@/models/mission.model";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMissionStore = defineStore('mission', () => {

    const missions = ref<Mission[]>([])
    const selectedMission = ref<Mission>({ id: 0, name: '', map1024: '', map256: '' })

    socketClient.listenToEvent<LoadMissionResponse>('loadMission', (data) => {
       selectedMission.value = { ...data.mission };
    })

    async function getMissions() {
        const data = await httpClient.request<undefined, Mission[]>({ url: '/missions', method: 'GET' })
        missions.value = data;
    }

    function launchMission(missionId: number) {
        socketClient.send('loadMission', { id: missionId })
    }

    return {
        missions,
        selectedMission,
        getMissions,
        launchMission
    }
})