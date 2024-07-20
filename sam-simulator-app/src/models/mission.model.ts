import type { EnvironmentRadar, EnvironmentSAM } from "./environment.model";

export interface Mission {
    id: number;
    name: string;
}

export interface LoadMissionResponse {
    mission: Mission;
    radars: EnvironmentRadar[]
    sams: EnvironmentSAM[]
}