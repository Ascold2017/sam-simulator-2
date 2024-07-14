import { samHttpClient, samSocketClient } from "@/adapters/clients";
import type { IRadarObject, SamSelectTargetPayload } from "@/model/sam.model";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useSupplyStore } from "./supply";
import { useRadarObjects } from "./radarObjects";

export const useTargets = defineStore("sam/targets", () => {
    const supplyStore = useSupplyStore();
    const radarObjectsStore = useRadarObjects();

    const currentTargetId = ref<string | null>(null);
    const selectedTargetIds = ref<string[]>([]);

    watch(() => supplyStore.isEnabled, (v) => {
        if (v) {
            subsribeUpdate();
        } else {
            currentTargetId.value = null;
            selectedTargetIds.value = [];
        }
    });

    function subsribeUpdate() {
        samSocketClient.listenToEvent(
            "SELECTED_TARGET_IDS_UPDATE",
            (payload: string[]) => {
                selectedTargetIds.value = [...payload];
            },
        );
    }

    function seekTarget() {
        let index = radarObjectsStore.detectedEnemies.findIndex((dro) =>
            dro.id === currentTargetId.value
        ) || 0;
        if (index === radarObjectsStore.detectedEnemies.length - 1) {
            index = 0;
        } else {
            index++;
        }

        currentTargetId.value = radarObjectsStore.detectedEnemies[index]?.id ||
            null;
    }

    async function selectTarget() {
        try {
            await samHttpClient.request<SamSelectTargetPayload, undefined>({
                method: "POST",
                path: "/select-target",
                payload: { id: currentTargetId.value! },
            });
        } catch (e: any) {
            console.log(e.message);
        }
    }

    async function unselectTarget() {
        try {
            await samHttpClient.request<SamSelectTargetPayload, undefined>({
                method: "POST",
                path: "/unselect-target",
                payload: { id: currentTargetId.value! },
            });
        } catch (e: any) {
            console.log(e.message);
        }
    }

    async function resetTargets() {
        try {
            await samHttpClient.request<undefined, undefined>({
                method: "POST",
                path: "/reset-targets",
            });
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return {
        currentTargetId,
        selectedTargetIds,
        seekTarget,
        selectTarget,
        unselectTarget,
        resetTargets,
    };
});
