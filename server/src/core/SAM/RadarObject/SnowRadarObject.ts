import BaseRadarObject from './BaseRadarObject.ts';
import { load } from 'https://deno.land/std@0.210.0/dotenv/mod.ts';

const env = await load();
export default class SnowRadarObject extends BaseRadarObject {
	constructor() {
		const maxDistance = Number(env['MAX_DISTANCE']);
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
