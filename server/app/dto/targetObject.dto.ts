import { TargetObject } from "core/Weapon/TargetObject";

export class TargetObjectDTO {
    public id: string;
    public azimuth: number;
    public elevation: number;
    public size: number;
    public visibilityK: number;
    constructor(
        targetObject: TargetObject,
    ) {
        this.id = targetObject.id;
        this.azimuth = targetObject.azimuth;
        this.elevation = targetObject.elevation;
        this.size = targetObject.size;
        this.visibilityK = targetObject.visibilityK;
    }
}
