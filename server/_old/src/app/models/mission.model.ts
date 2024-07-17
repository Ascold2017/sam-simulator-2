
export interface MissionIPoint {
    x: number;
    y: number; 
    z: number;
    v: number
}

export interface MissionEnvironmentEntity {
    id: number;
    type: 'radar' | 'sam'
    name: string;
    radarId: number;
    position: MissionIPoint
}

export interface MissionTask {
    id: string;
    flightObjectTypeId: number;
    points: MissionIPoint[];
    rcs: number;
    delay: number;
}
export interface MissionEntity {
    id: number;
    name: string;
    environment: MissionEnvironmentEntity[]
    tasks: MissionTask[]
}