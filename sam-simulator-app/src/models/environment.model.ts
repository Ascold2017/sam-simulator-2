
export interface EnvironmentResponse {
    radars: EnvironmentRadar[]
    sams: EnvironmentSAM[]
}

export interface EnvironmentRadar {
    id: number;
    name: string;
    position: { x: number; y: number; z: number }
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
    position: { x: number; y: number; z: number }
    radar: {
        maxDistance: number;
        maxCaptureRange: number;
        minCaptureRange: number;
        maxDetectCount: number;
        minElevation: number;
        maxElevation: number;
        radarHeight: number;
    }
    weapon: {
        type: 'missile' | 'gun';
        weaponMaxSelectedCount: number;
        weaponChannelsCount: number;
        weaponAmmoCount: number;
        weaponVelocity: number;
        weaponMaxDistance: number;
        ammoKillRadius: number;
        ammoMaxDeltaRotation: number;
    }
}