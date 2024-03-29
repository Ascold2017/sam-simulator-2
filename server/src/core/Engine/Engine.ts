import type BaseFlightObject from './FlightObject/BaseFlightObject.ts';
import Enemy from './FlightObject/Enemy.ts';
import LoopEngine from './LoopEngine/LoopEngine.ts';

export interface IPoint {
	x: number;
	y: number;
	z: number;
	v: number;
}
export interface IMission {
	id: number;
	flightObjectTypeId: number;
	points: IPoint[];
	rcs: number;
	delay: number;
}

export default class Engine extends LoopEngine {
	private flightObjects: BaseFlightObject[] = [];
	constructor() {
		super();
	}

	public startMission(missions: IMission[]) {
		missions.forEach((mission) =>
			this.addFlightObject(
				new Enemy(
					this,
					String(mission.id),
					mission.points,
					mission.rcs,
					false,
				),
			)
		);
	}

	public resetMission() {
		this.flightObjects.forEach((fo) => this.removeFlightObject(fo.id));
	}

	public addFlightObject(flightObject: BaseFlightObject) {
		this.flightObjects.push(flightObject);
		this.addFPSLoop(
			flightObject.id,
			(delta) => flightObject.update(delta),
			100,
		);
	}

	public removeFlightObject(id: string) {
		this.removeLoop(id);
		this.flightObjects = this.flightObjects.filter((fo) => fo.id !== id);
	}

	public getFlightObjects(): BaseFlightObject[] {
		return this.flightObjects.slice(0);
	}
}
