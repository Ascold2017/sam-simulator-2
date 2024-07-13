import BaseRadarObject from './BaseRadarObject.ts';
import samParams from '../../../samParams.json' with { type: 'json' };

export default class SnowRadarObject extends BaseRadarObject {
	public type = 'SNOW_RADAR_OBJECT';
	constructor() {
		const maxDistance = Number(samParams['MAX_DISTANCE']);
		super({
			id: Math.random().toString(),
			currentPoint: {
				x: -(maxDistance / 2) +
					maxDistance * Math.random(),
				y: -(maxDistance / 2) +
					maxDistance * Math.random(),
				z: Math.random() * 100,
				v: Math.random() * 200,
			},
			currentRotation: 2 * Math.PI * Math.random(),
			visibilityK: Math.random(),
		});
	}
}
