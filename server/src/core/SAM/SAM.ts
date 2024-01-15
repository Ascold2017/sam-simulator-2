import type Engine from '#engine/Engine.ts';
import Enemy from '#engine/FlightObject/Enemy.ts';
import Missile from '#engine/FlightObject/Missile.ts';
import BaseRadarObject from './RadarObject/BaseRadarObject.ts';
import DetectedRadarObject from './RadarObject/DetectedRadarObject.ts';
import SnowRadarObject from './RadarObject/SnowRadarObject.ts';
import UndetectedRadarObject from './RadarObject/UndetectedRadarObject.ts';
import samParams from '#src/assets/samParams.json' with { type: 'json' };
import _ from 'lodash';
import MissionLogger from '#src/core/MissionLogger.ts';

interface IListener {
	name: string;
	listener: () => void;
}
export class MissileChannel {
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
export class SAM {
	public isEnabled = false;
	private engine: Engine;
	private radarObjects:
		(DetectedRadarObject | UndetectedRadarObject | SnowRadarObject)[] = [];
	private selectedObjectIds: string[] = [];
	private missileChannels: Record<number, MissileChannel> = {};
	private missilesLeft = Number(samParams['MISSILES_COUNT']);
	private listeners = [] as IListener[];
	private logger = new MissionLogger();
	constructor(engine: Engine) {
		this.engine = engine;
		this.engine.addFPSLoop('updateRadar', () => this.updateRadar(), 40);
		const channelsCount = Number(
			samParams['MISSILES_CHANNEL_COUNT'] || 0,
		);
		for (let i = 0; i < channelsCount; i++) {
			this.missileChannels[i] = new MissileChannel(i);
		}
	}

	private updateRadar() {
		if (!this.isEnabled) {
			this.radarObjects = [];
			return;
		}
		const enemys = this.engine.getFlightObjects()
			.filter((fo) =>
				fo instanceof Enemy &&
				BaseRadarObject.getDistance(fo.getCurrentPoint()) <
					Number(samParams['MAX_DISTANCE'])
			)
			.sort(DetectedRadarObject.sortByVisibilityComparator);

		const detectedEnemys = enemys
			.filter((e) => {
				const distance = BaseRadarObject.getDistance(
					e.getCurrentPoint(),
				);
				return distance < Number(samParams['MAX_CAPTURE_RANGE']) &&
					distance > Number(samParams['MIN_CAPTURE_RANGE']);
			})
			.slice(0, Number(samParams['RADAR_MAX_DETECT_COUNT']) - 1);

		const undetectedEnemys = enemys.filter((e) =>
			!detectedEnemys.some((de) => de.id === e.id)
		);

		const missiles = this.engine.getFlightObjects().filter((fo) =>
			fo instanceof Missile
		);
		const detectedRadarObjects = detectedEnemys.map((fo) =>
			new DetectedRadarObject(fo)
		).filter((fo) => fo.isVisible);
		this.radarObjects = [
			...detectedRadarObjects,
			...undetectedEnemys.map((fo) => new UndetectedRadarObject(fo))
				.filter(
					(fo) => fo.isVisible,
				),
			...missiles.map((fo) => new DetectedRadarObject(fo)),
			// ...Array.from(Array(50)).map(() => new SnowRadarObject()),
		];
		// remove disapperead selected objects
		this.selectedObjectIds = this.selectedObjectIds.filter(
			(selectedObjectId) => {
				return detectedRadarObjects.some((dro) =>
					dro.id === selectedObjectId
				);
			},
		);
		// free missile channels with disappered targets
		for (const missileChannelId in this.missileChannels) {
			const missileChannelTarget =
				this.missileChannels[missileChannelId].target;
			if (
				!!missileChannelTarget?.id &&
				!detectedRadarObjects.some((dro) =>
					dro.id === missileChannelTarget?.id
				)
			) {
				this.missileChannels[missileChannelId].reset();
			}
		}

		this.listeners.forEach((l) => l.listener());
	}

	public setIsEnabled(value: boolean) {
		this.logger.log('SAM ' + value ? 'ENABLED' : 'DISABLED');
		this.isEnabled = value;
	}

	public getRadarObjects(): (
		| DetectedRadarObject
		| UndetectedRadarObject
		| SnowRadarObject
	)[] {
		return _.cloneDeep(this.radarObjects);
	}

	public getSelectedObjectIds(): string[] {
		return this.selectedObjectIds.slice(0);
	}

	public getMissileChannels(): MissileChannel[] {
		return _.cloneDeep(Object.values(this.missileChannels));
	}

	public getMissilesCount() {
		return this.missilesLeft;
	}

	public launchMissile(
		targetId: string,
		channelId: number,
		method: '3P' | '1/2',
	) {
		const target = this.radarObjects.find((dfo) =>
			dfo.id === targetId && dfo instanceof DetectedRadarObject &&
			!dfo.isMissile
		) as DetectedRadarObject;
		const channel = this.missileChannels[channelId];
		if (
			target && this.selectedObjectIds.includes(targetId) &&
			this.missilesLeft > 0 && channel && !channel.missile
		) {
			const missile = new Missile(
				this.engine,
				target.getFlightObject() as Enemy,
				method,
			);
			this.missilesLeft--;

			channel.set(target, missile);

			this.engine.addFlightObject(missile);

			this.logger.log(
				`MISSILE LAUNCHED ON CHANNEL: ${channelId} (${method}). TARGET: ${target.id} DISTANCE: ${target.distance}`,
			);
		}
	}

	public resetMissile(channelId: number) {
		this.missileChannels[channelId]?.reset();
		this.logger.log(`MISSILE RESETTET ON CHANNEL: ${channelId}`);
	}

	public selectTarget(targetId: string) {
		const radarObject = this.radarObjects.filter((ro) =>
			ro instanceof DetectedRadarObject
		).find((dro) => dro.id === targetId) as DetectedRadarObject;

		if (
			radarObject &&
			!this.selectedObjectIds.some((id) => id === targetId) &&
			this.selectedObjectIds.length <
				Number(samParams['RADAR_MAX_SELECTED_COUNT'])
		) {
			this.selectedObjectIds.push(radarObject.id);
			this.logger.log(`TARGET SELECTED: ${targetId}`);
		}
	}

	public unselectTarget(targetId: string) {
		if (this.selectedObjectIds.some((id) => id === targetId)) {
			Object.values(this.missileChannels).forEach((missileChannel) => {
				if (
					missileChannel.target &&
					missileChannel.target.id === targetId
				) {
					missileChannel.reset();
				}
			});
			this.selectedObjectIds = this.selectedObjectIds.filter((id) =>
				id !== targetId
			);
			this.logger.log(`TARGET UNSELECTED: ${targetId}`);
		}
	}

	public resetTargets() {
		this.selectedObjectIds = [];
		Object.values(this.missileChannels).forEach((missileChannel) =>
			missileChannel.reset()
		);
		this.logger.log(`TARGETS RESETTED`);
	}

	public addUpdateListener(name: string, listener: () => void) {
		this.listeners.push({ name, listener });
	}

	public removeUpdateListener(name: string) {
		this.listeners = this.listeners.filter((l) => l.name !== name);
	}
}
