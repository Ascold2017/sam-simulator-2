import { Engine, IPoint, MissionLogger, IRadarParams, Radar, IWeaponParams } from "../../core";
import { Environment } from "../entities/environment.entity";


export class EnvironmentRadarConstructorDTO {
    engine: Engine;
    logger: MissionLogger;
    position: IPoint;
    params: IRadarParams;
    name: string;

    constructor(engine: Engine, logger: MissionLogger, environment: Environment) {
        this.engine = engine;
        this.logger = logger;
        this.name = environment.name;
        this.params = environment.radar;
        this.position = { ...environment.position, v: 0 };
    }
}

export class EnvironmentWeaponConstructorDTO {
    engine: Engine;
    logger: MissionLogger;
    position: IPoint;
    radar: Radar;
    params: IWeaponParams;
    name: string;

    constructor(engine: Engine, logger: MissionLogger, environment: Environment, radar: Radar) {
        this.engine = engine;
        this.logger = logger;
        this.name = environment.name;
        this.radar = radar;
        this.position = { ...environment.position, v: 0 };
        this.params = {
            ammoLeft: environment.weapon.weaponAmmoCount,
            weaponChannelCount: environment.weapon.weaponChannelsCount,
            weaponMaxSelectedCount: environment.weapon.weaponMaxSelectedCount,
            ammoVelocity: environment.weapon.weaponVelocity,
            maxDistance: environment.weapon.weaponMaxDistance,
            maxDeltaRotation: environment.weapon.ammoMaxDeltaRotation,
            killRadius: environment.weapon.ammoKillRadius,
            minCaptureRange: environment.radar.minCaptureRange
        }
    }
}

export class EnvironmentRadarResponseDTO {
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
    constructor(environment: Environment) {
        this.id = environment.id;
        this.name = environment.name;
        this.position = environment.position;
        this.maxDistance = environment.radar.maxDistance;
        this.maxCaptureRange = environment.radar.maxCaptureRange;
        this.minCaptureRange = environment.radar.minCaptureRange;
        this.maxDetectCount = environment.radar.maxDetectCount;
        this.minElevation = environment.radar.minElevation;
        this.maxElevation = environment.radar.maxElevation;
        this.radarHeight = environment.radar.radarHeight;
    }
}

export class EnvironmentSAMResponseDTO {
    id: number;
    name: string;
    position: { x: number; y: number; z: number }
    radar: {
        id: number;
        maxDistance: number;
        maxCaptureRange: number;
        minCaptureRange: number;
        maxDetectCount: number;
        minElevation: number;
        maxElevation: number;
        radarHeight: number;
    }
    weapon: {
        id: number;
        type: 'missile' | 'gun';
        weaponMaxSelectedCount: number;
        weaponChannelsCount: number;
        weaponAmmoCount: number;
        weaponVelocity: number;
        weaponMaxDistance: number;
        ammoKillRadius: number;
        ammoMaxDeltaRotation: number;
    }
   
    constructor(environment: Environment) {
        this.id = environment.id;
        this.name = environment.name;
        this.position = environment.position;
        this.radar = {
            id: environment.radar.id,
            maxDistance: environment.radar.maxDistance,
            maxCaptureRange: environment.radar.maxCaptureRange,
            minCaptureRange: environment.radar.minCaptureRange,
            maxDetectCount: environment.radar.maxDetectCount,
            minElevation: environment.radar.minElevation,
            maxElevation: environment.radar.maxElevation,
            radarHeight: environment.radar.radarHeight
        }

        this.weapon = {
            id: environment.weapon.id,
            type: environment.weapon.type,
            weaponMaxSelectedCount: environment.weapon.weaponMaxSelectedCount,
            weaponChannelsCount: environment.weapon.weaponChannelsCount,
            weaponAmmoCount: environment.weapon.weaponAmmoCount,
            weaponVelocity: environment.weapon.weaponVelocity,
            weaponMaxDistance: environment.weapon.weaponMaxDistance,
            ammoKillRadius: environment.weapon.ammoKillRadius,
            ammoMaxDeltaRotation: environment.weapon.ammoMaxDeltaRotation
        }
    }
}

export class EnvironmentDTO {
    public id: number;
    public name: string;
    public type: 'radar' | 'sam'
    public position: { x: number; y: number; z: number };
    public radarId: number | null;
    public weaponId: number | null;
    constructor(environment: Environment) {
        this.id = environment.id;
        this.name = environment.name;
        this.type = environment.type;
        this.position = environment.position;
        this.radarId = environment.radar?.id || null;
        this.weaponId = environment.weapon?.id || null;
    }
}