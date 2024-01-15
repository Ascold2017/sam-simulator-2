import samParams from '#src/assets/samParams.json' with { type: 'json' };
import type Engine from '../Engine.ts';
import Vector3D from '#core/Vector3D.ts';
import BaseFlightObject from './BaseFlightObject.ts';
import type Enemy from './Enemy.ts';
import { IPoint } from '#src/core/Engine/Engine.ts';

type GuidanceMethod = '3P' | '1/2' | '1';

export default class Missile extends BaseFlightObject {
	private readonly target: Enemy;
	private readonly velocity;
	private readonly maxDistance;
	private readonly killRadius;
	private traveledDistance = 0;
	private method: GuidanceMethod;
	constructor(
		engine: Engine,
		target: Enemy,
		method: GuidanceMethod,
	) {
		const name = `Missile-${+new Date()}`;
		super(engine, name, 1);
		this.target = target;
		this.maxDistance = Number(samParams['MISSILE_MAX_DISTANCE']);
		this.killRadius = Number(samParams['MISSILE_KILL_RADIUS']);
		this.velocity = Number(samParams['MISSILE_VELOCITY']);
		this.method = method;
	}

	update(time: number): void {
		const dTime = time - this.timeInAir;
		super.update(time);
		if (!this.target) return this.destroy();
		const dFlightDistance = dTime * this.velocity;
		this.traveledDistance += dFlightDistance;

		const targetVector = new Vector3D(this.target.getCurrentPoint());

		const prevMissileVector = new Vector3D({ ...this.currentPoint });
		const targetDistance = targetVector.sub(prevMissileVector)
			.r() as number;

		const currentPositionHandler = {
			'3P': () =>
				this.calcMissilePosition(
					targetVector,
					prevMissileVector,
					targetDistance,
					dFlightDistance,
				),
			'1/2': () =>
				this.calcMissilePosition(
					this.calcPreemtiveVector(targetVector, targetDistance, 0.5),
					prevMissileVector,
					targetDistance,
					dFlightDistance,
				),
			'1': () =>
				this.calcMissilePosition(
					this.calcPreemtiveVector(targetVector, targetDistance, 1),
					prevMissileVector,
					targetDistance,
					dFlightDistance,
				),
		};

		const currentPosition = currentPositionHandler[this.method]();
		this.currentPoint = {
			x: currentPosition.x() as number,
			y: currentPosition.y() as number,
			z: currentPosition.z() as number,
			v: this.velocity,
		};

		const prevMissileRotation = this.currentRotation;

		this.currentRotation = Math.atan2(
			this.currentPoint.y - (prevMissileVector.y() as number),
			this.currentPoint.x - (prevMissileVector.x() as number),
		);

		const deltaRotation = Math.abs(
			prevMissileRotation - this.currentRotation,
		);

		if (
			this.traveledDistance > samParams.MIN_CAPTURE_RANGE &&
			deltaRotation > samParams.MISSILE_MAX_DELTA_ROTATION
		) {
			this.logger.log(
				`[MISSILE] Overloaded. Method: ${this.method}. Target: ${this.target.id}`,
			);
			this.destroy();
			return;
		}

		if (targetDistance <= this.killRadius) {
			this.target.kill();
			this.destroy();
			this.logger.log(
				`[MISSILE] HIT! Target ${this.target.id} has been killed. Hit distance: ${
					targetDistance.toFixed(1)
				} m. Method: ${this.method}`,
			);
			return;
		}
		if (
			this.traveledDistance >= this.maxDistance
		) {
			this.destroy();
			this.logger.log(
				`[MISSILE] Over range. Target: ${this.target.id}. Method: ${this.method}`,
			);
			return;
		}
	}

	private calcMissilePosition(
		targetVector: Vector3D,
		prevMissileVector: Vector3D,
		targetDistance: number,
		dFlightDistance: number,
	) {
		const distance = dFlightDistance < targetDistance
			? dFlightDistance
			: targetDistance;
		// https://qna.habr.com/q/1189118
		const a = targetVector.dot(targetVector);
		const b = -2 * prevMissileVector.dot(targetVector);
		const c = prevMissileVector.dot(prevMissileVector) - distance ** 2;
		const d = b ** 2 - 4 * a * c;
		const sqrt = Math.sqrt(d >= 0 ? d : 0);
		const t1 = (-b - sqrt) / (2 * a);
		const t2 = (-b + sqrt) / (2 * a);
		return targetVector.scale(t1 > t2 ? t1 : t2);
	}

	private calcPreemtiveVector(
		targetVector: Vector3D,
		targetDistance: number,
		scale: number,
	) {
		const radialVelocity = this.calcRadialVelocityOfTarget(
			this.target.getCurrentPoint(),
			this.target.getCurrentRotation(),
		);

		const timeToHit = targetDistance /
			(this.velocity + radialVelocity);
		const l = this.velocity * timeToHit * scale;

		return new Vector3D({
			x: l * Math.cos(this.target.getCurrentRotation()) +
				(targetVector.x() as number),
			y: l * Math.sin(this.target.getCurrentRotation()) +
				(targetVector.y() as number),
			z: targetVector.z() as number,
		});
	}

	private calcRadialVelocityOfTarget(
		targetPosition: IPoint,
		targetRotation: number,
	) {
		const targetAzimuth = Math.atan2(targetPosition.y, targetPosition.x);
		// Angle between azimut to flight object and rotation of flight object
		const targetAngle =
			(targetAzimuth > targetRotation
				? targetAzimuth - targetRotation
				: targetRotation - targetAzimuth) - Math.PI;
		return targetPosition.v * Math.cos(targetAngle);
	}
}
