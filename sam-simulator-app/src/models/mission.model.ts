import type { EnvironmentRadar, EnvironmentSAM } from "./environment.model";

export interface Mission {
    id: number;
    name: string;
    map256: string;
    map1024: string;
}

export interface LoadMissionResponse {
    mission: Mission;
    radars: EnvironmentRadar[]
    sams: EnvironmentSAM[]
}