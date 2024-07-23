import { Enemy, Engine, IPoint, Missile } from "../Engine";
import { MissionLogger } from "../MissionLogger";
import BaseRadarObject from "./RadarObject/BaseRadarObject";
import { DetectedRadarObject } from "./RadarObject/DetectedRadarObject";
import { UndetectedRadarObject } from "./RadarObject/UndetectedRadarObject";
import _ from "lodash";

export type RadarObject = DetectedRadarObject | UndetectedRadarObject;

interface IListener {
    name: string;
    listener: (radarObjects: RadarObject[], cursorAngle: number) => void;
}

export interface IRadarParams {
    maxDistance: number;
    maxCaptureRange: number;
    minCaptureRange: number;
    maxDetectCount: number;
    minElevation: number;
    maxElevation: number;
    radarHeight: number;
    updateTime: number;
}

interface IRadar {
    id: string;
    entityId: number;
    position: IPoint;
    name: string;
    engine: Engine;
    logger: MissionLogger;
    params: IRadarParams;
}

export class Radar {
    public isEnabled = false;
    public id: string;
    public entityId: number;
    public name: string;
    public params: IRadarParams;
    public position: IPoint;
    private engine: Engine;
    private logger: MissionLogger;
    private radarObjects: RadarObject[] = [];
    private listeners = [] as IListener[];
    private cursorAngle = 0; // текущий угол курсора в градусах
    private lastUpdateTime = Date.now(); // время последнего обновления

    constructor({ id, name, engine, logger, position, params, entityId }: IRadar) {
        this.id = id;
        this.entityId = entityId;
        this.name = name;
        this.params = params;
        this.position = position;
        this.engine = engine;
        this.logger = logger;
        this.engine.addFPSLoop(
            "updateRadar:" + name,
            () => this.updateRadar(),
            40,
        );
    }

    public setIsEnabled(value: boolean) {
        this.logger.log(
            `Radar <${this.name}> ${value ? "enabled" : "disabled"}`,
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
        listener: IListener['listener'],
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
                BaseRadarObject.getDistance(this.position, fo.getCurrentPoint()) <
                    this.params.maxDistance
            )
            .sort(DetectedRadarObject.sortByVisibilityComparator);

        const detected = allEnemies.filter((e) => {
            const distance = BaseRadarObject.getDistance(
                this.position,
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
        this.updateCursorAngle();

        const [detectedEnemies, undetectedEnemies] = this.getEnemies();

        const missiles = this.engine.getFlightObjects().filter((fo) =>
            fo instanceof Missile
        );

        const detectedRadarObjects = detectedEnemies.map((fo) =>
            new DetectedRadarObject(fo, this.params, this.position)
        ).filter((fo) => fo.isVisible);

        const undetectedRadarObjects = undetectedEnemies.map((fo) =>
            new UndetectedRadarObject(fo, this.params, this.position)
        ).filter(
            (fo) => fo.isVisible,
        );

        const allRadarObjects = [
            ...detectedRadarObjects,
            ...undetectedRadarObjects,
            ...missiles.map((fo) => new DetectedRadarObject(fo, this.params, this.position)),
        ];

        const newRadarObjects = this.radarObjects.filter((ro) => !this.isWithinCursorAngle(ro.x, ro.y));

        allRadarObjects.forEach((ro) => {
            if (this.isWithinCursorAngle(ro.x, ro.y)) {
                if (!newRadarObjects.some((obj) => obj.id === ro.id)) {
                    newRadarObjects.push(ro);
                }
            }
        });

        this.radarObjects = newRadarObjects;

        this.listeners.forEach((l) => l.listener(this.radarObjects, this.cursorAngle));
    }

    private updateCursorAngle() {
        const now = Date.now();
        const elapsedTime = (now - this.lastUpdateTime) / 1000; // время в секундах
        this.lastUpdateTime = now;

        const fullRotationTime = this.params.updateTime;
        const angleIncrement = (360 / fullRotationTime) * elapsedTime;
        this.cursorAngle = (this.cursorAngle + angleIncrement) % 360;
    }

    private isWithinCursorAngle(x: number, y: number): boolean {
        const angleToPoint = this.calculateAngleToPoint(x, y);
        return Math.abs(this.cursorAngle - angleToPoint) < (360 / 40);
    }

    private calculateAngleToPoint(x: number, y: number): number {
        let angle = Math.atan2(x, y) * (180 / Math.PI);
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
}
