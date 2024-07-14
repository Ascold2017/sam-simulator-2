import { samSocketClient } from "@/adapters/clients";
import type { IRadarObject } from "@/model/sam.model";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useSupplyStore } from "./supply";

export const useRadarObjects = defineStore("sam/radar-objects", () => {
    const supplyStore = useSupplyStore();

    const isUpdated = ref(false);
    const radarObjects = ref<IRadarObject[]>([]);

    const detectedEnemies = computed(() =>
        radarObjects.value.filter((ro) =>
            ro.type === "DETECTED_RADAR_OBJECT" && !ro.isMissile
        )
    );

    watch(() => supplyStore.isEnabled, (v) => {
        console.log(v)
        if (v) {
            subsribeUpdate();
        } else {
            radarObjects.value = []
        }
    });

    function subsribeUpdate() {
        console.log('sub')
        samSocketClient.listenToEvent(
            "RADAR_OBJECTS_UPDATE",
            (payload: IRadarObject[]) => {
                isUpdated.value = true;
                const t = setTimeout(() => {
                    isUpdated.value = false;
                    clearTimeout(t);
                }, 300);
                radarObjects.value = [...payload];
            },
        );
    }

    return {
        isUpdated,
        radarObjects,
        detectedEnemies,
    };
});
