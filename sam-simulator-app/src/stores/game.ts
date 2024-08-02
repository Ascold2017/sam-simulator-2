import { httpClient } from "@/adapters/httpClient";

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { Mission } from '@shared/models/missions.model'
import { socketClient } from "@/adapters/socketClient";
import { type EnvironmentRadar, type EnvironmentSAM, type RadarObjectResponse, type RadarUpdateResponse, type RadarEnabledResponse, type GetCurrentMissionResponse, type PostRadarEnabledPayload, type WeaponMoveCursorResponse } from "@shared/models/game.model";
import _ from 'lodash'

const defaultMission = {
    id: 0,
    name: "",
    map1024: "",
    map256: "",
}
export const useGameStore = defineStore("game", () => {
    const router = useRouter();

    const isLoadingMission = ref(false);
    const isInitialized = ref(false);
    const currentMission = ref<Mission>(defaultMission);
    const radars = ref<EnvironmentRadar[]>([]);
    const sams = ref<EnvironmentSAM[]>([]);
    const radarObjectsByRadarIds = ref<Record<string, RadarObjectResponse[]>>({})
    const cursorAnglesByRadarIds = ref<Record<string, number>>({})
    const targetCursorsByWeaponIds = ref<Record<string, WeaponMoveCursorResponse>>({})

    socketClient.listenToEvent<RadarUpdateResponse>('radarUpdates', (data) => {
        radarObjectsByRadarIds.value = {
            ...radarObjectsByRadarIds.value,
            [data.radarId]: data.radarObjects
        }
        cursorAnglesByRadarIds.value = {
            ...cursorAnglesByRadarIds.value,
            [data.radarId]: data.cursorAngle
        }
    })
    socketClient.listenToEvent<RadarEnabledResponse>('radarEnabled', (data) => {

        if (!data.radarEnabled) {
            radarObjectsByRadarIds.value[data.radarId] = []
        }

        radars.value = radars.value.map(radar => {
            if (radar.gameId === data.radarId) {
                radar.isEnabled = data.radarEnabled;
            }
            return radar;
        })
        sams.value = sams.value.map(sam => {
            if (sam.radar.gameId === data.radarId) {
                sam.radar.isEnabled = data.radarEnabled;
            }
            return sam;
        })
    })
    socketClient.listenToEvent<WeaponMoveCursorResponse>('moveCursor', (data) => {
        targetCursorsByWeaponIds.value = {
            ...targetCursorsByWeaponIds.value,
            [data.weaponId]: data
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
            router.push({ name: "gameMap" });
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
            isInitialized.value = true;
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
        } catch (e) {
            console.error(e);
        }
    }

    async function stopMission() {
        try {
            await httpClient.request<undefined, undefined>({
                url: "/game/stop-mission",
                method: "POST",
            });

            radars.value = []
            sams.value = []
            currentMission.value = defaultMission;
            isInitialized.value = false;
            radarObjectsByRadarIds.value = {}
            cursorAnglesByRadarIds.value = {}
            router.push({ name: 'start' })

        } catch (e) {
            console.error(e);
        }
    }

    function moveTargetCursor(weaponId: string, azimuth: number, elevation: number) {
        socketClient.send('moveCursor', {
            weaponId,
            azimuth,
            elevation,
            distance: 0
        })
    }

    async function captureTarget(weaponId: string) {
        socketClient.send('captureTarget', {
            weaponId,
        })
    }

    async function resetTarget(weaponId: string) {
        socketClient.send('resetTarget', {
            weaponId,
        })
    }

    async function fire(weaponId: string, method: string) {
        socketClient.send('fireTarget', {
            weaponId,
            method
        })
    }

    return {
        targetCursorsByWeaponIds,
        cursorAnglesByRadarIds,
        radarObjectsByRadarIds,
        currentMission,
        isLoadingMission,
        isInitialized,
        radars,
        sams,
        launchMission,
        getCurrentMission,
        setEnableRadar,
        stopMission,

        moveTargetCursor,
        captureTarget,
        resetTarget,
        fire
    };
});
