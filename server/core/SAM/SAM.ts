import { IPoint, Engine } from "../Engine";
import MissionLogger from "../MissionLogger";
import { Radar } from "../Radar";
import { IRadarParams } from "../Radar/Radar";
import { Weapon } from "../Weapon";
import { IWeaponParams } from "../Weapon/Weapon";


interface ISAM {
    name: string,
    position: IPoint;
    engine: Engine,
    logger: MissionLogger
    radarParams: IRadarParams
    weaponParams: IWeaponParams
}
export class SAM {
    public name: string;
    public radar: Radar;
    public weapon: Weapon;
    public radarParams: IRadarParams
    constructor({ name, engine, logger, position, radarParams, weaponParams }: ISAM) {
        this.name = name;
        this.radar = new Radar({
            name: 'Radar ' + this.name,
            engine: engine,
            logger,
            position,
            params: radarParams

        });
        this.weapon = new Weapon({
            name: 'Weapon ' + this.name,
            engine,
            radar: this.radar,
            logger,
            params: weaponParams
        })
    }
}