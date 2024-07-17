import { Radar } from '#src/core/Radar/index.ts';
import { Weapon } from '#src/core/Weapon/index.ts';
import { Engine, IPoint } from '#engine/index.ts';
import MissionLogger from '#src/core/MissionLogger.ts';

interface ISAM {
    name: string,
    position: IPoint;
    engine: Engine,
    logger: MissionLogger
}
export class SAM {
    public name: string;
    public radar: Radar;
    public weapon: Weapon;
    constructor({ name, engine, logger, position }: ISAM) {
        this.name = name;
        this.radar = new Radar({
            name: 'Radar ' + this.name,
            engine: engine,
            logger,
            position
        });
        this.weapon = new Weapon({
            name: 'Weapon ' + this.name,
            engine,
            radar: this.radar,
            logger
        })
    }
}