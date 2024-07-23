import type { Mission } from "./missions.model";

export interface EnvironmentRadar {
    id: number;
    isEnabled: boolean;
    gameId: string;
    name: string;
    position: { x: number; y: number; z: number };
    maxDistance: number;
    maxCaptureRange: number;
    minCaptureRange: number;
    maxDetectCount: number;
    minElevation: number;
    maxElevation: number;
    radarHeight: number;
    updateTime: number;
}

export interface EnvironmentSAM {
    id: number;
    name: string;
    position: { x: number; y: number; z: number };
    radar: {
        isEnabled: boolean;
        gameId: string;
        maxDistance: number;
        maxCaptureRange: number;
        minCaptureRange: number;
        maxDetectCount: number;
        minElevation: number;
        maxElevation: number;
        radarHeight: number;
        updateTime: number;
    };
    weapon: {
        gameId: string;
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
    radarGameId: string;
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
    radarId: string;
    radarObjects: RadarObjectResponse[];
}
