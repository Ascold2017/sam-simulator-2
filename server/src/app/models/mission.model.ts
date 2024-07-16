
export interface MissionIPoint {
    x: number;
    y: number; 
    z: number;
    v: number
}

export interface MissionEnvironmentEntity {
    type: 'radar' | 'sam'
    name: string;
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