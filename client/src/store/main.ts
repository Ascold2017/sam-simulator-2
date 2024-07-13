import { samHttpClient, samSocketClient } from "@/adapters/clients";
import Sounds from "@/helpers/sounds";
import type { IRadarObject, IMissileChannel, ILog, SamSettingsResponse, SamSelectTargetPayload, SamLaunchMissilePayload, SamResetMissilePayload } from "@/model/sam.model";
import { defineStore } from "pinia";


export const useMainStore = defineStore("mainStore", {
  state: () => ({
    isEnabled: false,
    isShowResults: false,
    currentTargetId: null as string | null,
    radarObjects: [] as IRadarObject[],
    selectedTargetIds: [] as string[],
    missileChannels: [] as IMissileChannel[],
    missilesLeft: 0,
    isUpdated: false,
    logs: [] as ILog[],
    samParams: {
      MAX_DISTANCE: 0,
      MIN_CAPTURE_RANGE: 0,
      MAX_CAPTURE_RANGE: 0,
      MISSILE_MAX_DISTANCE: 0,
      MISSILES_COUNT: 0,
      MISSILE_VELOCITY: 0,
      RADAR_AZIMUT_DETECT_ACCURACY: 0,
      RADAR_ELEVATION_DETECT_ACCURACY: 0,
      RADAR_DISTANCE_DETECT_ACCURACY: 0,
    },
  }),
  getters: {
    detectedEnemies(state) {
      return state.radarObjects.filter((ro) =>
        ro.type === "DETECTED_RADAR_OBJECT" && !ro.isMissile
      );
    },
  },

  actions: {
    connect() {
      this.isEnabled = true;
      samSocketClient.connect()
      samSocketClient.listenToEvent('RADAR_OBJECTS_UPDATE', (payload: IRadarObject[]) => {
        this.isUpdated = true;
        const t = setTimeout(() => {
          this.isUpdated = false;
          clearTimeout(t);
        }, 300)
        this.radarObjects = [...payload];
      })

      samSocketClient.listenToEvent('SELECTED_TARGET_IDS_UPDATE', (payload: string[]) => {
        this.selectedTargetIds = [...payload]
      })

      samSocketClient.listenToEvent('MISSILE_CHANNELS_UPDATE', (payload: IMissileChannel[]) => {
        this.missileChannels = [...payload]
      })

      samSocketClient.listenToEvent('MISSILES_LEFT_UPDATE', (payload: number) => {
        this.missilesLeft = payload
      })
      
    },
    disconnect() {
      samSocketClient.disconnect()
      this.isEnabled = false;
      this.radarObjects = [];
      this.selectedTargetIds = [];
      this.missilesLeft = 0;
    },
    setIsEnabled(value: boolean) {
      if (value) {
        Sounds.startEngine();
        const i = setTimeout(() => {
          this.connect();
          clearTimeout(i);
        }, 3000);
      } else {
        Sounds.stopEngine();
        this.disconnect();
        this.getLogs();
        this.isShowResults = true;
      }
    },
    seekTarget() {
      let index = this.detectedEnemies.findIndex((dro) =>
        dro.id === this.currentTargetId
      ) || 0;
      if (index === this.detectedEnemies.length - 1) {
        index = 0;
      } else {
        index++;
      }

      this.currentTargetId = this.detectedEnemies[index]?.id || null;
    },

    async getSamSettings() {
      try {
        const data = await samHttpClient.request<undefined, SamSettingsResponse>({
          method: 'GET',
          path: '/settings'
        })
        this.missileChannels = Array.from(Array(data["MISSILES_CHANNEL_COUNT"]))
          .map((_, index) => ({ id: index, isBusy: true }));
        this.samParams = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async selectTarget() {
      try {
        await samHttpClient.request<SamSelectTargetPayload, undefined>({
          method: 'POST',
          path: '/select-target',
          payload: { id: this.currentTargetId! }
        })
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async unselectTarget() {
      try {
        await samHttpClient.request<SamSelectTargetPayload, undefined>({
          method: 'POST',
          path: '/unselect-target',
          payload: { id: this.currentTargetId! }
        })
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async resetTargets() {
      try {
        await samHttpClient.request<undefined, undefined>({
          method: 'POST',
          path: '/reset-targets',
        })
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async launchMissile(channelId: number, method: string) {
      try {
        await samHttpClient.request<SamLaunchMissilePayload, undefined>({
          method: 'POST',
          path: '/launch-missile',
          payload: {
              id: this.currentTargetId!,
              channelId,
              method,
          }
        })
        Sounds.missileStart();
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async resetMissile(channelId: number) {
      try {
        await samHttpClient.request<SamResetMissilePayload, undefined>({
          method: 'POST',
          path: '/reset-missile',
          payload: {
              channelId,
          }
        })
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getLogs() {
      try {
        const data = await samHttpClient.request<undefined, ILog[]>({
          path: '/logs',
          method: 'GET'
        })
        this.logs = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
