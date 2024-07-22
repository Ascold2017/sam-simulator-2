import { IPoint } from "../../Engine";
import { IRadarParams } from "../Radar";


interface BaseRadarObjectConstructor {
	id: string;
	currentPoint: IPoint;
	currentRotation: number;
	visibilityK: number;
	radarParams: IRadarParams
	radarPosition: IPoint;
}
export default class BaseRadarObject {
	public id: string;
	public distance: number;
	public azimuth: number;
	public elevation: number;
	public radialVelocity: number;
	public velocity: number;
	public height: number;
	public param: number;
	public x: number;
	public y: number;
	public rotation: number;
	public size: number;
	public visibilityK: number;
	public isVisible: boolean;
	public hitPosition = { x: 0, y: 0 };
	private radarParams: IRadarParams;
	private radarPosition: IPoint

	constructor(payload: BaseRadarObjectConstructor) {
		this.radarParams = payload.radarParams;
		this.radarPosition = payload.radarPosition;
		this.id = payload.id;
		const distance = BaseRadarObject.getDistance(this.radarPosition, payload.currentPoint);
		this.distance = distance;
		const azimuth = this.getAzimuth(payload.currentPoint);
		this.azimuth = azimuth < 0 ? 2 * Math.PI + azimuth : azimuth;
		this.elevation = this.getTargetElevation(
			distance,
			payload.currentPoint.z,
		);
		this.velocity = payload.currentPoint.v;
		this.radialVelocity = this.getRadialVelocity(
			azimuth,
			payload.currentRotation,
			payload.currentPoint,
		);
		this.height = payload.currentPoint.z;
		this.param = this.getTargetParam(
			azimuth,
			distance,
			payload.currentRotation,
		);
		this.x = payload.currentPoint.x;
		this.y = payload.currentPoint.y;
		this.rotation = payload.currentRotation;
		this.size = 2 * Math.sqrt(payload.visibilityK / Math.PI);
		this.visibilityK = payload.visibilityK > 1 ? 1 : payload.visibilityK;

		const inAllowedElevation =
			this.elevation > this.radarParams.minElevation &&
			this.elevation < this.radarParams.maxElevation;
		this.isVisible = this.isInVision(distance, payload.currentPoint.z) &&
			inAllowedElevation &&
			distance < this.radarParams.maxDistance;
		//this.hitPosition = this.getHitPosition();
	}

	protected isInVision(distance: number, height: number) {
		return Math.sqrt(2 * 6371009 * this.radarParams.radarHeight) +
				Math.sqrt(2 * 6371009 * height) > distance;
	}

	public static getDistance(radarPoint: IPoint, currentPoint: IPoint) {
		const dx = currentPoint.x - radarPoint.x;
        const dy = currentPoint.y - radarPoint.y;
        return Math.hypot(dx, dy);
	}

	protected getAzimuth(currentPoint: IPoint) {
		const dx = currentPoint.x - this.radarPosition.x;
        const dy = currentPoint.y - this.radarPosition.y;
        return Math.atan2(dy, dx);
	}

	protected getTargetElevation(distance: number, height: number) {
		const targetHeightOffset = height - this.radarParams.radarHeight;
		// Vertical angle from SNR to target
		return (targetHeightOffset / distance);
	}

	protected getRadialVelocity(
		targetAzimuth: number,
		currentRotation: number,
		currentPoint: IPoint,
	) {
		// Angle between azimut to flight object and rotation of flight object
		const targetAngle =
			(targetAzimuth > currentRotation
				? targetAzimuth - currentRotation
				: currentRotation - targetAzimuth) - Math.PI;

		// Radial velocity
		return currentPoint.v * Math.cos(targetAngle);
	}

	protected getTargetParam(
		targetAzimuth: number,
		targetDistance: number,
		currentRotation: number,
	) {
		// Angle between azimut to flight object and rotation of flight object
		const targetAngle =
			(targetAzimuth > currentRotation
				? targetAzimuth - currentRotation
				: currentRotation - targetAzimuth) - Math.PI;
		return Math.abs(targetDistance * Math.tan(targetAngle));
	}

	/*
	protected getHitPosition() {
		const timeToHit = this.distance / (this.radialVelocity +
			samParams.MISSILE_VELOCITY);
		const l = this.velocity * timeToHit;
		const preemtiveVector = {
			x: l * Math.cos(this.rotation) + this.x,
			y: l * Math.sin(this.rotation) + this.y,
		};

		return preemtiveVector;
	}*/
}
