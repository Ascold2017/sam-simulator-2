import { defineStore } from "pinia";
import _ from "lodash";
import type {
  EditorStartPayload,
  IFlightObjectType,
  IMission,
  IPoint,
  ITask,
} from "@/model/editor.model";
import { HttpClient } from "@/adapters/httpClient";
import { editorHttpClient, samHttpClient } from "@/adapters/clients";

const defaultMission: IMission = {
  id: null,
  name: "",
  tasks: [],
};

const defaultTask: ITask = {
  id: null,
  points: [],
  flightObjectTypeId: null,
  delay: 0,
};



export const useMissionEditorStore = defineStore("missionEditorStore", {
  state: () => ({
    missions: [] as IMission[],
    flightObjectTypes: [] as IFlightObjectType[],
    currentMission: _.cloneDeep(defaultMission),
    selectedTask: _.cloneDeep(defaultTask),
    selectedPointIndex: null as number | null,
  }),

  getters: {
    selectedFlightObjectType(state) {
      return state.flightObjectTypes.find((fot) =>
        fot.id === state.selectedTask.flightObjectTypeId
      );
    },
    selectedPoint(state) {
      if (state.selectedPointIndex === null) return { x: 0, y: 0, z: 0, v: 0 };
      return state.selectedTask.points[state.selectedPointIndex] ||
        { x: 0, y: 0, z: 0, v: 0 };
    },
  },

  actions: {
    async getMissions() {
      try {
        const data = await editorHttpClient.request<undefined, IMission[]>({
          method: "GET",
          path: "/missions",
        });
        this.missions = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async startMission(id: number) {
      try {
        await samHttpClient.request<EditorStartPayload, undefined>({
          method: "POST",
          path: "/start",
          payload: { id },
        });
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getFlightObjectTypes() {
      try {
        const data = await editorHttpClient.request<
          undefined,
          IFlightObjectType[]
        >({
          method: "GET",
          path: "/flight-object-types",
        });
        this.flightObjectTypes = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },

    addPoint(point: IPoint) {
      this.selectedTask.points.push(point);
    },

    selectPoint(pointIndex: number) {
      this.selectedPointIndex = pointIndex;
    },

    setPointParam(paramName: string, value: string) {
      // @ts-ignore
      this.selectedTask.points[this.selectedPointIndex][paramName] = value;
    },

    removePoint() {
      this.selectedTask.points = this.selectedTask.points.filter((_, i) =>
        i !== this.selectedPointIndex
      );
    },

    selectTask(taskId: number) {
      this.selectedTask = _.cloneDeep(
        this.currentMission.tasks.find((t) => t.id === taskId) || defaultTask,
      );
    },

    saveTask() {
      if (
        this.selectedTask.id !== null &&
        this.currentMission.tasks.find((t) => t.id === this.selectedTask.id)
      ) {
        this.currentMission.tasks = this.currentMission.tasks.map((task) => {
          return task.id === this.selectedTask.id ? this.selectedTask : task;
        });
      } else {
        this.selectedTask.id = this.currentMission.tasks.length;
        this.currentMission.tasks.push(this.selectedTask);
      }

      this.resetTask();
    },

    resetTask() {
      this.selectedTask = _.cloneDeep(defaultTask);
    },

    resetMission() {
      this.currentMission.id !== null
        ? this.selectMission(this.currentMission.id)
        : this.clearMission();
    },

    clearMission() {
      this.currentMission = _.cloneDeep(defaultMission);
      this.resetTask();
    },

    async saveMission() {
      try {
        await editorHttpClient.request<IMission, undefined>({
          method: "POST",
          path: "/save-mission",
          payload: this.currentMission,
        });

        this.resetMission();
        this.getMissions();
      } catch (e: any) {
        console.log(e.message);
      }
    },

    selectMission(missionId: number) {
      this.currentMission = _.cloneDeep(
        this.missions.find((m) => m.id === missionId)!,
      );
    },

    download() {
      const mission = JSON.stringify(this.currentMission);
      const filename = this.currentMission.name + ".json";
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8, " + encodeURIComponent(mission),
      );
      element.setAttribute("download", filename);
      document.body.appendChild(element);
      element.click();
    },
  },
});
