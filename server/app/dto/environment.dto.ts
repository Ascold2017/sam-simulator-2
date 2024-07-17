import { Engine, IPoint } from "../../core/Engine";
import MissionLogger from "../../core/MissionLogger";
import { IRadarParams } from "../../core/Radar/Radar";
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
    }
}

export class EnvironmentSAMDTO {
    engine: Engine;
    logger: MissionLogger;
    position: IPoint;
    radarParams: IRadarParams;
    weaponParams: IWeaponParams;
    name: string;

    constructor(engine: Engine, logger: MissionLogger, environment: Environment) {
        this.engine = engine;
        this.logger = logger;
        this.name = environment.name;
        this.radarParams = environment.radar;
        this.weaponParams = {
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