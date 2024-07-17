import { IPoint } from "../../core/Engine";
import { Radar } from "../../core/Radar";
import { IRadarParams } from "../../core/Radar/Radar";

export class RadarDTO {
    public id: number;
    public isEnabled: boolean;
    public name: string;
    public params: IRadarParams;
    public position: IPoint;
    constructor(radar: Radar, id: number) {
        this.id = id;
        this.isEnabled = radar.isEnabled;
        this.name = radar.name;
        this.params = radar.params;
        this.position = radar.position;
    }
}