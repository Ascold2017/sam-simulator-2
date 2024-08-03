import _ from "lodash";
import { Enemy, Engine, Missile } from "../Engine";
import { MissionLogger } from "../MissionLogger";
import { DetectedRadarObject, Radar } from "../Radar";
import { MissileParams } from "../Engine/FlightObject/Missile";
import { TargetObject } from "./TargetObject";

export interface IWeaponParams extends MissileParams {
	ammoLeft: number;
	minElevation: number;
	maxElevation: number;
	angleOfView: number;
}

type IListener = (
	payload: {
		cursorAzimuth: number;
		cursorElevation: number;
		ammoLeft: number;
		capturedTargetId: string | null;
		targetObjects: TargetObject[]
	},
) => void;

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
	private cursorAzimuth: number = 0;
	private cursorElevation: number = 0;
	private listener: IListener;
	private targetObjects: TargetObject[] = []

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
		this.engine.addFPSLoop("updateWeapon:" + this.name, () => this.updateWeapon());
	}

	private updateWeapon() {
		
		this.targetObjects = this.engine.getFlightObjects().map(fo => new TargetObject({
			id: fo.id,
			currentPoint: fo.getCurrentPoint(),
			targetCursorAzimuth: this.cursorAzimuth,
			targetCursorElevation: this.cursorElevation,
			weaponPosition: this.radar.position,
			visibilityK: fo.visibilityK,
			params: this.params
		})).filter(to => to.isVisible)

		if (this.selectedObjectId) {
			if (this.selectedTarget) {
				this.cursorAzimuth = this.selectedTarget.azimuth;
				this.cursorElevation = this.selectedTarget.elevation;
			} else {
				this.unselectTarget();
			}
			
		}

		this.listener && this.listener({
			cursorAzimuth: this.cursorAzimuth,
			cursorElevation: this.cursorElevation,
			capturedTargetId: this.selectedTarget?.id || null,
			ammoLeft: this.ammoLeft,
			targetObjects: this.targetObjects
		});
	}

	public addListener(cb: IListener) {
		this.listener = cb;
	}

	public removeListener() {
		this.listener = null;
	}

	public get selectedTarget() {
		return this.targetObjects.find((ro) =>
			ro.id === this.selectedObjectId
		) || null;
	}

	public launchWeapon(
		method: "3P" | "1/2",
	) {
		const target = this.radar.getRadarObjects().find((dfo) =>
			dfo.id === this.selectedObjectId &&
			dfo instanceof DetectedRadarObject &&
			!dfo.isMissile
		) as DetectedRadarObject;
		if (target && this.ammoLeft > 0) {
			if (this.launchedAmmo) {
				this.resetLaunchedAmmo()
			}
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
		this.launchedAmmo = null;
		this.logger.log(`[${this.name}] Missile reset`);
	}

	public unselectTarget() {
		this.selectedObjectId = null;
		this.resetLaunchedAmmo();
		this.logger.log(`[${this.name}] Target unselected`);
	}

	public captureTarget() {
		const target = this.radar.getRadarObjects().filter((ro) =>
			ro instanceof DetectedRadarObject
		).find((dro) => {
			return (Math.abs(dro.azimuth - this.cursorAzimuth) < 0.1) &&
				(Math.abs(dro.elevation - this.cursorElevation) < 0.1);
		}) as DetectedRadarObject;

		if (target) {
			this.selectedObjectId = target.id;
			this.logger.log(`[${this.name}] Target selected: ${target.id}`);
			return target.id;
		}

		return null;
	}

	public moveCursor(azimuth: number, elevation: number) {
		if (this.selectedObjectId) return;
		this.cursorAzimuth = this.normalizeAzimuth(azimuth);
		this.cursorElevation = this.normalizeElevation(elevation);
	}

	private normalizeAzimuth(azimuth: number): number {
		const twoPi = 2 * Math.PI;
		return ((azimuth % twoPi) + twoPi) % twoPi;
	}

	private normalizeElevation(elevation: number): number {
		const minElevation = -3 * (Math.PI / 180); // -3 градуса в радианы
		const maxElevation = 55 * (Math.PI / 180); // 55 градусов в радианы
		return Math.max(minElevation, Math.min(maxElevation, elevation));
	}
}
