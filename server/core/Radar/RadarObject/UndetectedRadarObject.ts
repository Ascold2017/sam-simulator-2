import type BaseFlightObject from '#engine/FlightObject/BaseFlightObject.ts';
import { IRadarParams } from '#src/core/Radar/Radar.ts';
import BaseRadarObject from './BaseRadarObject.ts';

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
