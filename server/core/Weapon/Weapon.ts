import _ from "lodash";
import { Enemy, Engine, Missile } from "../Engine";
import { MissionLogger } from "../MissionLogger";
import { DetectedRadarObject, Radar } from "../Radar";
import { MissileParams } from "../Engine/FlightObject/Missile";

export interface IWeaponParams extends MissileParams {
	ammoLeft: number;
}

interface IWeapon {
	id: string;
	entityId: number;
	name: string;
	engine: Engine;
	radar: Radar;
	logger: MissionLogger;
	params: IWeaponParams;
}
export class Weapon {
	public id: string;
	public entityId: number;
	public name: string;
	private selectedObjectId: string | null = null;
	private launchedAmmo: Missile | null = null;
	private ammoLeft: number;
	private engine: Engine;
	private radar: Radar;
	private logger: MissionLogger;
	private params: IWeaponParams;

	constructor(
		{ id, entityId, name, engine, radar, logger, params }: IWeapon,
	) {
		this.id = id;
		this.entityId = entityId;
		this.name = name;
		this.engine = engine;
		this.radar = radar;
		this.logger = logger;
		this.params = params;
		this.ammoLeft = params.ammoLeft;
	}

	public getSelectedObjectId(): string {
		return this.selectedObjectId;
	}
	public get selectedTarget() {
		return this.radar.getRadarObjects().find(ro => ro.id === this.selectedObjectId) || null
	}

	public getAmmoCount() {
		return this.ammoLeft;
	}

	public launchWeapon(
		method: "3P" | "1/2",
	) {
		const target = this.radar.getRadarObjects().find((dfo) =>
			dfo.id === this.selectedObjectId &&
			dfo instanceof DetectedRadarObject &&
			!dfo.isMissile
		) as DetectedRadarObject;
		if (target && this.ammoLeft > 0 && !this.launchedAmmo) {
			const missile = new Missile(
				this.engine,
				target.getFlightObject() as Enemy,
				method,
				this.params,
			);
			this.ammoLeft--;
			this.launchedAmmo = missile;

			this.engine.addFlightObject(missile);

			this.logger.log(
				`[${this.name}] Launch (method: ${method}). Target: ${target.id}, distance: ${
					(target.distance / 1000).toFixed(1)
				} km`,
			);

			return true;
		}

		return false;
	}

	public resetLaunchedAmmo() {
		this.launchedAmmo?.destroy();
		this.logger.log(`[${this.name}] Missile reset`);
	}

	public unselectTarget() {
		this.selectedObjectId = null;
		this.resetLaunchedAmmo();
		this.logger.log(`[${this.name}] Target unselected`);
	}

	public captureTargetByAzimuthElevationDistance(
		azimuth: number,
		elevation: number,
		distance: number,
	) {
		const target = this.radar.getRadarObjects().filter((ro) =>
			ro instanceof DetectedRadarObject
		).find((dro) => {
			return (Math.abs(dro.azimuth - azimuth) < 0.1) &&
				(Math.abs(dro.elevation - elevation) < 0.1) &&
				(Math.abs(dro.distance - distance) < 500);
		}) as DetectedRadarObject;

		this.selectedObjectId = target.id;
		this.logger.log(`[${this.name}] Target selected: ${target.id}`);
		return target.id;
	}
}
