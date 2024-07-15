import { Missile, Engine, Enemy, IPoint } from '#engine/index.ts';
import BaseRadarObject from './RadarObject/BaseRadarObject.ts';
import { DetectedRadarObject } from './RadarObject/DetectedRadarObject.ts';
import { UndetectedRadarObject } from './RadarObject/UndetectedRadarObject.ts';
import samParams from '../../samParams.json' with { type: 'json' };
import _ from 'lodash';
import MissionLogger from '#src/core/MissionLogger.ts';

interface IListener {
    name: string;
    listener: () => void;
}

interface IRadar {
    position: IPoint;
    name: string;
    engine: Engine;
    logger: MissionLogger;
}
export class Radar {
    public isEnabled = false;
    public name: string;
    public position: IPoint;
    private engine: Engine;
    private logger: MissionLogger;
    private radarObjects: (DetectedRadarObject | UndetectedRadarObject)[] = [];
    private listeners = [] as IListener[];
    constructor({ name, engine, logger, position }: IRadar) {
        this.name = name;
        this.position = position;
        this.engine = engine;
        this.logger = logger;
        this.engine.addFPSLoop(
            'updateRadar:' + name,
            () => this.updateRadar(),
            40,
        );
    }

    public setIsEnabled(value: boolean) {
        this.logger.log(
            `Radar <${this.name}> ${value ? 'enabled' : 'disabled'}`,
        );
        this.isEnabled = value;
    }

    public getRadarObjects(): (
        | DetectedRadarObject
        | UndetectedRadarObject
    )[] {
        return _.cloneDeep(this.radarObjects);
    }

    public addUpdateListener(name: string, listener: () => void) {
        this.listeners.push({ name, listener });
    }

    public removeUpdateListener(name: string) {
        this.listeners = this.listeners.filter((l) => l.name !== name);
    }

    private getEnemies() {
        const allEnemies = this.engine.getFlightObjects()
            .filter((fo) =>
                fo instanceof Enemy &&
                BaseRadarObject.getDistance(fo.getCurrentPoint()) <
                    Number(samParams['MAX_DISTANCE'])
            )
            .sort(DetectedRadarObject.sortByVisibilityComparator);

        const detected = allEnemies.filter((e) => {
            const distance = BaseRadarObject.getDistance(
                e.getCurrentPoint(),
            );
            return distance < Number(samParams['MAX_CAPTURE_RANGE']) &&
                distance > Number(samParams['MIN_CAPTURE_RANGE']);
        })
            .slice(0, Number(samParams['RADAR_MAX_DETECT_COUNT']) - 1);

        const undetected = allEnemies.filter((e) =>
            !detected.some((de) => de.id === e.id)
        );

        return [detected, undetected];
    }

    private updateRadar() {
        if (!this.isEnabled) {
            this.radarObjects = [];
            return;
        }
        const [detectedEnemies, undetectedEnemies] = this.getEnemies();

        const missiles = this.engine.getFlightObjects().filter((fo) =>
            fo instanceof Missile
        );

        const detectedRadarObjects = detectedEnemies.map((fo) =>
            new DetectedRadarObject(fo)
        ).filter((fo) => fo.isVisible);

        const undetectedRadarObjects = undetectedEnemies.map((fo) =>
            new UndetectedRadarObject(fo)
        ).filter(
            (fo) => fo.isVisible,
        );

        this.radarObjects = [
            ...detectedRadarObjects,
            ...undetectedRadarObjects,
            ...missiles.map((fo) => new DetectedRadarObject(fo)),
        ];

        this.listeners.forEach((l) => l.listener());
    }
}
