import { IPoint } from "core/Engine";
import { IRadarParams } from "../Radar";
import BaseRadarObject from "./BaseRadarObject";
export default class SnowRadarObject extends BaseRadarObject {
	public type = "SNOW_RADAR_OBJECT";
	constructor(radarParams: IRadarParams, radarPosition: IPoint) {
		super({
			id: Math.random().toString(),
			currentPoint: {
				x: -(radarParams.maxDistance / 2) +
					radarParams.maxDistance * Math.random(),
				y: -(radarParams.maxDistance / 2) +
					radarParams.maxDistance * Math.random(),
				z: Math.random() * 100,
				v: Math.random() * 200,
			},
			currentRotation: 2 * Math.PI * Math.random(),
			visibilityK: Math.random(),
			radarParams,
			radarPosition,
		});
	}
}
