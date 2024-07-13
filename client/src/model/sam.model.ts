export interface IRadarObject {
    type:
        | "DETECTED_RADAR_OBJECT"
        | "UNDETECTED_RADAR_OBJECT"
        | "SNOW_RADAR_OBJECT";
    id: string;
    x: number;
    y: number;
    azimuth: number;
    elevation: number;
    distance: number;
    rotation: number;
    velocity: number;
    radialVelocity: number;
    height: number;
    param: number;
    size: number;
    visibilityK: number;
    isMissile?: boolean;
    hitPosition: {
        x: number;
        y: number;
    };
}
export interface IMissileChannel {
    id: number;
    isBusy: boolean;
}

export interface ILog {
    time: number;
    message: string;
}

export interface SamSettingsResponse {
    MAX_DISTANCE: number;
    MIN_CAPTURE_RANGE: number;
    MAX_CAPTURE_RANGE: number;
    MISSILE_MAX_DISTANCE: number;
    MISSILES_COUNT:number;
    MISSILE_VELOCITY: number;
    RADAR_AZIMUT_DETECT_ACCURACY: number;
    RADAR_ELEVATION_DETECT_ACCURACY: number;
    
    RADAR_DISTANCE_DETECT_ACCURACY: number;
    MISSILES_CHANNEL_COUNT: number;
}

export interface SamSelectTargetPayload {
    id: string
}

export interface SamLaunchMissilePayload {
    id: string;
    channelId: number;
    method: string
}

export interface SamResetMissilePayload {
    channelId: number;
}