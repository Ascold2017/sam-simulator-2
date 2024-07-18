import { Mission } from "../entities/mission.entity";

export class MissionDTO {
    public id: number;
    public name: string;
    constructor(mission: Mission) {
        this.id = mission.id;
        this.name = mission.name;
    }
}