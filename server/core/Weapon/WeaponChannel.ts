import { Missile } from '#engine/index.ts';
import { DetectedRadarObject } from '#src/core/Radar/index.ts';

export class WeaponChannel {
	public id: number;
	public target: DetectedRadarObject | null = null;
	public missile: Missile | null = null;
	constructor(id: number) {
		this.id = id;
	}
	public set(target: DetectedRadarObject, missile: Missile) {
		this.target = target;
		this.missile = missile;
	}
	public reset() {
		this.target = null;
		this.missile?.destroy();
		this.missile = null;
	}
}
