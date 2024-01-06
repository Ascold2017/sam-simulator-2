import { defineStore } from "pinia";
import _ from "lodash";
export interface IPoint {
  x: number;
  y: number;
  z: number;
  v: number;
}
interface IMission {
  id: number | null;
  name: string;
  tasks: ITask[];
}
export interface ITask {
  id: number | null;
  points: IPoint[];
  flightObjectTypeId: number | null;
  delay: number;
}
export interface IFlightObjectType {
  id: number;
  maxVelocity: number;
  altitude: number;
  name: string;
}

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
    selectedPointIndex: null as number | null
  }),

  getters: {
    selectedFlightObjectType(state) {
      return state.flightObjectTypes.find((fot) =>
        fot.id === state.selectedTask.flightObjectTypeId
      );
    },
    selectedPoint(state) {
      if (state.selectedPointIndex === null) return { x: 0, y: 0, z: 0, v: 0 }
      return state.selectedTask.points[state.selectedPointIndex] || { x: 0, y: 0, z: 0, v: 0 };
    }
  },

  actions: {
    async getMissions() {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_BASE_URL + "/missions",
          {
            method: "GET",
            mode: "cors",
          },
        );
        const data = await response.json();
        this.missions = data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async startMission(id: number) {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_BASE_URL + "/start",
          {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ id }),
          },
        );
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getFlightObjectTypes() {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_BASE_URL + "/flight-object-types",
          {
            method: "GET",
            mode: "cors",
          },
        );
        const data = await response.json();
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
        console.log(this.currentMission)
        try {
            const response = await fetch(
              import.meta.env.VITE_API_BASE_URL + "/save-mission",
              {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(this.currentMission)
              },
            );
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
  },
});
