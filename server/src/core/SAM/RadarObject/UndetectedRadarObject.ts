import type BaseFlightObject from '#engine/FlightObject/BaseFlightObject.ts';
import BaseRadarObject from './BaseRadarObject.ts';

export default class UndetectedRadarObject extends BaseRadarObject {
	public type = 'UNDETECTED_RADAR_OBJECT';
	constructor(flightObject: BaseFlightObject) {
		super({
			id: flightObject.id,
			currentPoint: flightObject.getCurrentPoint(),
			currentRotation: flightObject.getCurrentRotation(),
			visibilityK: flightObject.visibilityK * 2 * Math.random(),
		});
	}
}
