import type BaseFlightObject from '#engine/FlightObject/BaseFlightObject.ts';
import { Missile } from '#engine/index.ts';
import { IRadarParams } from '#src/core/Radar/Radar.ts';
import BaseRadarObject from './BaseRadarObject.ts';

export class DetectedRadarObject extends BaseRadarObject {
	public type = 'DETECTED_RADAR_OBJECT';
	public isMissile: boolean;
	private flightObject: BaseFlightObject;
	constructor(flightObject: BaseFlightObject, radarParams: IRadarParams) {
		super({
			id: flightObject.id,
			visibilityK: flightObject.visibilityK,
			currentPoint: flightObject.getCurrentPoint(),
			currentRotation: flightObject.getCurrentRotation(),
			radarParams
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
