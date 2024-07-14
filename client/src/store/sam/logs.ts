import { samHttpClient } from "@/adapters/clients";
import type { ILog } from "@/model/sam.model";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useSupplyStore } from "./supply";

export const useLogsStore = defineStore("sam/logs", () => {

    const supplyStore = useSupplyStore();
    const logs = ref<ILog[]>([]);

    watch(() => supplyStore.isEnabled, (v) => {
        !v && getLogs()
    })

    async function getLogs() {
        try {
            const data = await samHttpClient.request<undefined, ILog[]>({
                path: "/logs",
                method: "GET",
            });
            logs.value = data;
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return {
        logs,
        getLogs,
    };
});
