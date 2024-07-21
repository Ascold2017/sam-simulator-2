import { httpClient } from "@/adapters/httpClient";
import { defineStore } from "pinia";
import { ref } from "vue";

import type { Mission, GetMissionsResponse } from '@shared/models/missions.model'

export const useMissionsStore = defineStore('missions', () => {
    const missions = ref<Mission[]>([]);

    async function getMissions() {
        const data = await httpClient.request<undefined, GetMissionsResponse>({
            url: "/missions",
            method: "GET",
        });
        missions.value = data;
    }


    return {
        missions,
        getMissions
    }
})