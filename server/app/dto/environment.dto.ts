import { Engine, IPoint } from "../../core/Engine";
import MissionLogger from "../../core/MissionLogger";
import { IRadarParams, Radar } from "../../core/Radar/Radar";
import { IWeaponParams } from "../../core/Weapon/Weapon";
import { Environment } from "../entities/environment.entity";


export class EnvironmentRadarDTO {
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

export class EnvironmentWeaponDTO {
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