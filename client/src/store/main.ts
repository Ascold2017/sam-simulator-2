import Sounds from "@/const/SOUNDS/index";
import { defineStore } from "pinia";

export interface IRadarObject {
  type:
    | "DETECTED_RADAR_OBJECT"
    | "UNDETECTED_RADAR_OBJECT"
    | "SNOW_RADAR_OBJECT";
  id: string;
  x: number;
  y: number;
  azimuth: number;
  elevation: number;
  distance: number;
  rotation: number;
  velocity: number;
  radialVelocity: number;
  height: number;
  param: number;
  size: number;
  visibilityK: number;
  isMissile?: boolean;
}
export interface IMissileChannel {
  id: number;
  isBusy: boolean;
}

export interface IMission {
  id: number;
  name: string;
}
export interface IFlightObjectType {
  id: number;
  maxVelocity: number;
  name: string;
}
export const useMainStore = defineStore("mainStore", {
  state: () => ({
    socket: null as WebSocket | null,
    isEnabled: false,
    currentTargetId: null as string | null,
    radarObjects: [] as IRadarObject[],
    selectedTargetIds: [] as string[],
    missileChannels: [] as IMissileChannel[],
    missilesLeft: 0,

    missions: [] as IMission[],
    flightObjectTypes: [] as IFlightObjectType[],

    samParams: {
      MAX_DISTANCE: 0,
      MIN_CAPTURE_RANGE: 0,
      MAX_CAPTURE_RANGE: 0,
      MISSILE_MAX_DISTANCE: 0,
      MISSILES_COUNT: 0,
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
      this.socket = new WebSocket("ws://127.0.0.1:8000");
      this.socket.addEventListener("open", () => {
        console.info("SOCKET OPENED");
        this.isEnabled = true;
      });
      this.socket.addEventListener(
        "close",
        () => console.info("SOCKET CLOSED"),
      );
      this.socket.addEventListener(
        "error",
        (e) => console.error("SOCKET ERROR", e),
      );
      this.socket.addEventListener("message", (message) => {
        const [type, jsonPayload] = message.data.split("|") as string[];
        const actions: Record<string, (payload: any) => void> = {
          "RADAR_OBJECTS_UPDATE": (payload: IRadarObject[]) => {
            console.log("UPDATE");
            this.radarObjects = [...payload];
          },
          "SELECTED_TARGET_IDS_UPDATE": (payload: string[]) =>
            this.selectedTargetIds = [...payload],
          "MISSILE_CHANNELS_UPDATE": (payload: IMissileChannel[]) =>
            this.missileChannels = [...payload],
          "MISSILES_LEFT_UPDATE": (payload: number) =>
            this.missilesLeft = payload,
        };

        const action = actions[type];
        // @ts-ignore
        if (action) {
          const payload = JSON.parse(jsonPayload);
          action(payload);
        }
      });
    },
    disconnect() {
      this.socket && this.socket.close();
      this.isEnabled = false;
      this.radarObjects = [];
      this.selectedTargetIds = [];
      this.missileChannels = [];
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
    async getMissions() {
      try {
        const response = await fetch("http://127.0.0.1:8001/missions", {
          method: "GET",
          mode: "cors",
        });
        const data = await response.json();
        this.missions = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getFlightObjectTypes() {
      try {
        const response = await fetch("http://127.0.0.1:8001/flight-object-types", {
          method: "GET",
          mode: "cors",
        });
        const data = await response.json();
        this.flightObjectTypes = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },

    async getSamSettings() {
      try {
        const response = await fetch("http://127.0.0.1:8001/sam-settings", {
          method: "GET",
          mode: "cors",
        });
        const data = await response.json();
        this.samParams = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async selectTarget() {
      try {
        const response = await fetch("http://127.0.0.1:8001/select-target", {
          method: "POST",
          mode: "cors",
          body: this.currentTargetId,
        });
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async unselectTarget() {
      try {
        const response = await fetch("http://127.0.0.1:8001/unselect-target", {
          method: "POST",
          mode: "cors",
          body: this.currentTargetId,
        });
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async resetTargets() {
      try {
        const response = await fetch("http://127.0.0.1:8001/reset-targets", {
          method: "POST",
          mode: "cors",
          body: this.currentTargetId,
        });
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async launchMissile() {
      try {
        const response = await fetch("http://127.0.0.1:8001/launch-missile", {
          method: "POST",
          mode: "cors",
          body: this.currentTargetId,
        });
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async resetMissile() {
      try {
        const response = await fetch("http://127.0.0.1:8001/reset-missile", {
          method: "POST",
          mode: "cors",
          body: this.currentTargetId,
        });
      } catch (e: any) {
        console.log(e.message);
      }
    }
  },
});
