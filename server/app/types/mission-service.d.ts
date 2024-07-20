
export interface EnvironmentPayload {
    name: string,
    type: "radar" | "sam",
    position: { x: number; y: number; z: number },
    radarId?: number,
    weaponId?: number
}

export interface MissionFlightTaskPayload {
    name: string, delay: number;
    points: { x: number; y: number; z: number; v: number }[];
    flightObjectTypeId: number;
}
export interface CreateMissionPayload {
    name: string;
    lat: number;
    lon: number;
    environments: EnvironmentPayload[], 
    tasks: MissionFlightTaskPayload[] 
}