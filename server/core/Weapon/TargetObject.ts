import { IPoint } from "core/Engine";
import { IWeaponParams } from "./Weapon";

interface TargetObjectConstructor {
    id: string;
    currentPoint: IPoint;
    visibilityK: number;
    weaponPosition: IPoint;
    params: IWeaponParams;
    targetCursorAzimuth: number;
    targetCursorElevation: number;
}

export class TargetObject {
    public id: string;
    public distance: number;
    public azimuth: number;
    public elevation: number;
    public size: number;
    public visibilityK: number;
    private weaponPosition: IPoint;
    private weaponParams: IWeaponParams;
    private currentPoint: IPoint;
    private cursorAzimuth: number;
    private cursorElevation: number;

    constructor(payload: TargetObjectConstructor) {
        this.id = payload.id;
        this.weaponParams = payload.params;
        this.currentPoint = payload.currentPoint;
        this.cursorAzimuth = payload.targetCursorAzimuth;
        this.cursorElevation = payload.targetCursorElevation;
        const distance = this.getDistance(
            this.weaponPosition,
            payload.currentPoint,
        );
        this.distance = distance;
        const azimuth = this.getAzimuth(payload.currentPoint);
        this.azimuth = azimuth < 0 ? 2 * Math.PI + azimuth : azimuth;
        this.elevation = this.getTargetElevation(
            distance,
            payload.currentPoint.z,
        );
        this.size = 2 * Math.sqrt(payload.visibilityK / Math.PI);
        this.visibilityK = payload.visibilityK > 1 ? 1 : payload.visibilityK;
    }

    public get isVisible() {
        const isUnderHorizont = Math.sqrt(2 * 6371009 * this.weaponPosition.z) +
                Math.sqrt(2 * 6371009 * this.currentPoint.z) > this.distance;

        const isOnCursorRay =
            (Math.abs(this.azimuth - this.cursorAzimuth) < this.weaponParams.angleOfView/2) &&
            (Math.abs(this.elevation - this.cursorElevation) < this.weaponParams.angleOfView/2);

        return isUnderHorizont && isOnCursorRay;
    }

    public getDistance(radarPoint: IPoint, currentPoint: IPoint) {
        const dx = currentPoint.x - radarPoint.x;
        const dy = currentPoint.y - radarPoint.y;
        return Math.hypot(dx, dy);
    }

    protected getAzimuth(currentPoint: IPoint) {
        const dx = currentPoint.x - this.weaponPosition.x;
        const dy = currentPoint.y - this.weaponPosition.y;
        return Math.atan2(dy, dx);
    }

    protected getTargetElevation(distance: number, height: number) {
        const targetHeightOffset = height - this.weaponPosition.z;
        // Vertical angle from SNR to target
        return (targetHeightOffset / distance);
    }
}
