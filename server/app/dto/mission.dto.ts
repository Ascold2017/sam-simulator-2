import { Mission } from "../entities/mission.entity";

export class MissionDTO {
    public id: number;
    public name: string;
    public map256: string;
    public map1024: string;

    constructor(mission: Mission) {
        this.id = mission.id;
        this.name = mission.name;
        this.map256 = mission.map256;
        this.map1024 = mission.map1024;
    }
}