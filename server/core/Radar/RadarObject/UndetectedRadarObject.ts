import BaseFlightObject from "../../Engine/FlightObject/BaseFlightObject";
import { IRadarParams } from "../Radar";
import BaseRadarObject from "./BaseRadarObject";


export class UndetectedRadarObject extends BaseRadarObject {
	public type = 'UNDETECTED_RADAR_OBJECT';
	constructor(flightObject: BaseFlightObject, radarParams: IRadarParams) {
		super({
			id: flightObject.id,
			currentPoint: flightObject.getCurrentPoint(),
			currentRotation: flightObject.getCurrentRotation(),
			visibilityK: flightObject.visibilityK * 2 * Math.random(),
			radarParams
		});
	}
}
