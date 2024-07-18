import { socketClient } from "@/adapters/socketClient";
import type { EnvironmentRadar, EnvironmentSAM, EnvironmentResponse } from "@/models/environment.model";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEnvironmentStore = defineStore('environment', () => {

    const radars = ref<EnvironmentRadar[]>([])
    const sams = ref<EnvironmentSAM[]>([]);

    socketClient.listenToEvent<EnvironmentResponse>('loadMission', (data) => {
        radars.value = data.radars;
        sams.value = data.sams;
    })

    return {
        radars,
        sams
    }
})