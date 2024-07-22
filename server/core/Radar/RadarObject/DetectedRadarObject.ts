import { IPoint, Missile } from "../../Engine";
import BaseFlightObject from "../../Engine/FlightObject/BaseFlightObject";
import { IRadarParams } from "../Radar";
import BaseRadarObject from "./BaseRadarObject";


export class DetectedRadarObject extends BaseRadarObject {
	public type = 'DETECTED_RADAR_OBJECT';
	public isMissile: boolean;
	private flightObject: BaseFlightObject;
	constructor(flightObject: BaseFlightObject, radarParams: IRadarParams, radarPosition: IPoint) {
		super({
			id: flightObject.id,
			visibilityK: flightObject.visibilityK,
			currentPoint: flightObject.getCurrentPoint(),
			currentRotation: flightObject.getCurrentRotation(),
			radarParams,
			radarPosition
		});
		this.flightObject = flightObject;
		this.isMissile = flightObject instanceof Missile;
	}

	public getFlightObject(): BaseFlightObject {
		return this.flightObject;
	}

	static sortByVisibilityComparator(
		enemy1: BaseFlightObject,
		enemy2: BaseFlightObject,
	): number {
		return enemy1.visibilityK < enemy2.visibilityK ? 1 : -1;
	}
}
