import samParams from '#src/assets/samParams.json' with { type: 'json' };
import type Engine from '../Engine.ts';
import Vector3D from '#core/Vector3D.ts';
import BaseFlightObject from './BaseFlightObject.ts';
import type Enemy from './Enemy.ts';

type GuidanceMethod = '3P' | '1/2';

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
		console.log(method);
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

		const hitPositionPreemtives = {
			'3P': new Vector3D({ x: 0, y: 0, z: 0 }),
			'1/2': new Vector3D({ x: 0, y: 0, z: 0 }), // TODO
		};

		const preemtiveVector = hitPositionPreemtives[this.method];

		const currentPosition = this.calcMissilePosition(
			targetVector.add(preemtiveVector),
			prevMissileVector,
			targetDistance,
			dFlightDistance,
		);
		this.currentPoint = {
			x: currentPosition.x() as number,
			y: currentPosition.y() as number,
			z: currentPosition.z() as number,
			v: this.velocity,
		};

		if (targetDistance <= this.killRadius) {
			this.target.kill();
			this.destroy();
			return;
		}
		if (
			this.traveledDistance >= this.maxDistance
		) {
			this.destroy();
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
}
