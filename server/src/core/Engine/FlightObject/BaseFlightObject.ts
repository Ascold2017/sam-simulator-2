import MissionLogger from '#src/core/MissionLogger.ts';
import type { IPoint } from '../Engine.ts';
import type Engine from '../Engine.ts';

export default class BaseFlightObject {
	readonly id: string;
	// TODO make visibilityK dynamic
	public visibilityK: number;
	protected currentPoint: IPoint = { x: 0, y: 0, z: 0, v: 0 };
	protected currentRotation = 0;
	protected isDestroyed = false;
	protected timeInAir = 0;
	protected readonly engine: Engine;
	protected logger = new MissionLogger();

	constructor(engine: Engine, id: string, visibilityK: number) {
		this.id = id;
		this.engine = engine;
		this.visibilityK = visibilityK;
	}

	getCurrentPoint() {
		return { ...this.currentPoint };
	}

	getCurrentRotation() {
		return this.currentRotation;
	}

	update(time: number) {
		this.timeInAir = time;
	}

	destroy() {
		if (!this.isDestroyed) {
			this.isDestroyed = true;
			this.engine.removeFlightObject(this.id);
		}
	}
}
