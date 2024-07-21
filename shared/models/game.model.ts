import type { Mission } from "./missions.model";

export interface EnvironmentRadar {
    id: number;
    name: string;
    position: { x: number; y: number; z: number };
    maxDistance: number;
    maxCaptureRange: number;
    minCaptureRange: number;
    maxDetectCount: number;
    minElevation: number;
    maxElevation: number;
    radarHeight: number;
}

export interface EnvironmentSAM {
    id: number;
    name: string;
    position: { x: number; y: number; z: number };
    radar: {
        id: number;
        maxDistance: number;
        maxCaptureRange: number;
        minCaptureRange: number;
        maxDetectCount: number;
        minElevation: number;
        maxElevation: number;
        radarHeight: number;
    };
    weapon: {
        id: number;
        type: "missile" | "gun";
        weaponMaxSelectedCount: number;
        weaponChannelsCount: number;
        weaponAmmoCount: number;
        weaponVelocity: number;
        weaponMaxDistance: number;
        ammoKillRadius: number;
        ammoMaxDeltaRotation: number;
    };
}

export interface GetCurrentMissionResponse {
    mission: Mission;
    radars: EnvironmentRadar[];
    sams: EnvironmentSAM[];
}

export interface PostRadarEnabledPayload {
    radarId: number;
    value: boolean;
}

export interface RadarObjectResponse {
    id: string;
    distance: number;
    azimuth: number;
    elevation: number;
    radialVelocity: number;
    velocity: number;
    height: number;
    param: number;
    x: number;
    y: number;
    rotation: number;
    size: number;
    visibilityK: number;
    isMissile: boolean;
    type: string;
}

export interface RadarUpdateResponse {
    radarId: number;
    radarObjects: RadarObjectResponse[];
}
