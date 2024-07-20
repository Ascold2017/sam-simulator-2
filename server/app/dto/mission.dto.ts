import { Mission } from "../entities/mission.entity";
import { EnvironmentDTO } from "./environment.dto";
import { MissionTaskDTO } from "./missionTask.dto";

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

export class MissionFullDTO extends MissionDTO {
    public environments: EnvironmentDTO[]
    public tasks: MissionTaskDTO[]
    constructor(mission: Mission) {
        super(mission)
        this.environments = mission.environments.map(env => new EnvironmentDTO(env))
        this.tasks = mission.tasks.map(t => new MissionTaskDTO(t))
    }
}