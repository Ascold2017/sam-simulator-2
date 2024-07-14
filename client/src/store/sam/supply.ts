import { samSocketClient } from "@/adapters/clients";
import Sounds from "@/helpers/sounds";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSupplyStore = defineStore("sam/supply", () => {
    const isEnabled = ref(false);

    function setIsEnabled(value: boolean) {
        if (value) {
            Sounds.startEngine();
            const i = setTimeout(() => {
                samSocketClient.connect();
                isEnabled.value = true;
                clearTimeout(i);
            }, 3000);
        } else {
            Sounds.stopEngine();
            samSocketClient.disconnect();
            isEnabled.value = false;
        }
    }

    return {
        isEnabled,
        setIsEnabled,
    };
});
