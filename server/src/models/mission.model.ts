export interface MissionEntity {
    id: number;
    name: string;
}

export interface EnvironmentEntity {
    id: number;
    name: string;
    type: 'radar' | 'sam';
    entityId: number; // radar or sam
    position: { x: number; y: number; z: number };
}

export interface RadarEntity {
    id: number;
    name: string;
    maxDistance: number;
    maxCaptureRange: number;
    minCaptureRange: number;
    maxDetectCount: number;
    minElevation: number;
    maxElevation: number;
    radarHeight: number;
}

export interface SAMEntity {
    id: number;
    name: string;
    radarId: number;
    type: 'missile' | 'gun'
    weaponMaxSelectedCount: number;
    weaponChannelsCount: number;
    weaponAmmoCount: number;
    weaponVelocity: number;
    weaponMaxDistance: number;
    ammoKillRadius: number;
    ammoMaxDeltaRotation: number;
}

export interface MissionFlightTask {
    id: number;
    name: string;
    flightObjectTypeId: number;
    points: { x: number; y: number; z: number; v: number }[];
    delay: number;
}

export interface FlightObjectType {
    id: number;
    name: string;
    rcs: number;
    maxVelocity: number;
    altitude: number;
}