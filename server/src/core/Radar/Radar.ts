import { Enemy, Engine, IPoint, Missile } from '#engine/index.ts';
import BaseRadarObject from './RadarObject/BaseRadarObject.ts';
import { DetectedRadarObject } from './RadarObject/DetectedRadarObject.ts';
import { UndetectedRadarObject } from './RadarObject/UndetectedRadarObject.ts';
import _ from 'lodash';
import MissionLogger from '#src/core/MissionLogger.ts';

type RadarObject = DetectedRadarObject | UndetectedRadarObject;

interface IListener {
    name: string;
    listener: (radarObjects: RadarObject[]) => void;
}

export interface IRadarParams {
    maxDistance: number;
    maxCaptureRange: number;
    minCaptureRange: number;
    maxDetectCount: number;
    minElevation: number;
    maxElevation: number;
    radarHeight: number;
}

interface IRadar {
    position: IPoint;
    name: string;
    engine: Engine;
    logger: MissionLogger;
    params: IRadarParams;
}

export class Radar {
    public isEnabled = false;
    public name: string;
    public params: IRadarParams;
    public position: IPoint;
    private engine: Engine;
    private logger: MissionLogger;
    private radarObjects: RadarObject[] = [];
    private listeners = [] as IListener[];
    constructor({ name, engine, logger, position, params }: IRadar) {
        this.name = name;
        this.params = params;
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

    public addUpdateListener(
        name: string,
        listener: (radarObjects: RadarObject[]) => void,
    ) {
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
                    this.params.maxDistance
            )
            .sort(DetectedRadarObject.sortByVisibilityComparator);

        const detected = allEnemies.filter((e) => {
            const distance = BaseRadarObject.getDistance(
                e.getCurrentPoint(),
            );
            return distance < this.params.maxCaptureRange &&
                distance > this.params.minCaptureRange;
        })
            .slice(0, this.params.maxDetectCount - 1);

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
            new DetectedRadarObject(fo, this.params)
        ).filter((fo) => fo.isVisible);

        const undetectedRadarObjects = undetectedEnemies.map((fo) =>
            new UndetectedRadarObject(fo, this.params)
        ).filter(
            (fo) => fo.isVisible,
        );

        this.radarObjects = [
            ...detectedRadarObjects,
            ...undetectedRadarObjects,
            ...missiles.map((fo) => new DetectedRadarObject(fo, this.params)),
        ];

        this.listeners.forEach((l) => l.listener(this.radarObjects));
    }
}
