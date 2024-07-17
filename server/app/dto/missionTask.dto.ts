import { MissionFlightTask } from "../entities/flightTask.entity";


export class MissionTaskDTO {
    id: number;
    points: { x: number; y: number; z: number; v: number }[];
    rcs: number;
    delay: number;
    constructor(task: MissionFlightTask) {
        this.id = task.id;
        this.points = task.points;
        this.rcs = task.flightObjectType.rcs;
        this.delay = task.delay;
    }
}
