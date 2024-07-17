import samParams from '../../samParams.json' with { type: 'json' };
import _ from 'lodash';
import { WeaponChannel } from './WeaponChannel.ts';
import { Radar } from '#src/core/Radar/index.ts';

import { DetectedRadarObject } from '#src/core/Radar/index.ts';

import { Missile, Engine, Enemy } from '#engine/index.ts';
import MissionLogger from '#src/core/MissionLogger.ts';

interface IWeapon {
	name: string;
	engine: Engine;
	radar: Radar;
	logger: MissionLogger;
}
export class Weapon {
	private name: string;
	private selectedObjectIds: string[] = [];
	private weaponChannels: Record<number, WeaponChannel> = {};
	private ammoLeft = Number(samParams['MISSILES_COUNT']);
	private engine: Engine;
	private radar: Radar;
	private logger: MissionLogger;

	constructor({ name, engine, radar, logger }: IWeapon) {
		this.name = name;
		this.engine = engine;
		this.radar = radar;
		this.logger = logger;
		const channelsCount = Number(
			samParams['MISSILES_CHANNEL_COUNT'] || 0,
		);
		for (let i = 0; i < channelsCount; i++) {
			this.weaponChannels[i] = new WeaponChannel(i);
		}
	}

	public getSelectedObjectIds(): string[] {
		return this.selectedObjectIds.slice(0);
	}

	public getWeaponChannels(): WeaponChannel[] {
		return _.cloneDeep(Object.values(this.weaponChannels));
	}

	public getAmmoCount() {
		return this.ammoLeft;
	}

	public launchWeapon(
		targetId: string,
		channelId: number,
		method: '3P' | '1/2',
	) {
		const target = this.radar.getRadarObjects().find((dfo) =>
			dfo.id === targetId && dfo instanceof DetectedRadarObject &&
			!dfo.isMissile
		) as DetectedRadarObject;
		const channel = this.weaponChannels[channelId];
		if (
			target && this.selectedObjectIds.includes(targetId) &&
			this.ammoLeft > 0 && channel && !channel.missile
		) {
			const missile = new Missile(
				this.engine,
				target.getFlightObject() as Enemy,
				method,
			);
			this.ammoLeft--;

			channel.set(target, missile);

			this.engine.addFlightObject(missile);

			this.logger.log(
				`[${this.name}] Launch on channel: ${channelId} (method: ${method}). Target: ${target.id}, distance: ${
					(target.distance / 1000).toFixed(1)
				} km`,
			);
		}
	}

	public resetWeaponChannel(channelId: number) {
		this.weaponChannels[channelId]?.reset();
		this.logger.log(`[MISSILE] Reset on channel: ${channelId}`);
	}

	public selectTarget(targetId: string) {
		const radarObject = this.radar.getRadarObjects().filter((ro) =>
			ro instanceof DetectedRadarObject
		).find((dro) => dro.id === targetId) as DetectedRadarObject;

		if (
			radarObject &&
			!this.selectedObjectIds.some((id) => id === targetId) &&
			this.selectedObjectIds.length <
				Number(samParams['RADAR_MAX_SELECTED_COUNT'])
		) {
			this.selectedObjectIds.push(radarObject.id);
			this.logger.log(`[${this.name}] Target selected: ${targetId}`);
		}
	}

	public unselectTarget(targetId: string) {
		if (this.selectedObjectIds.some((id) => id === targetId)) {
			Object.values(this.weaponChannels).forEach((weaponChannel) => {
				if (
					weaponChannel.target &&
					weaponChannel.target.id === targetId
				) {
					weaponChannel.reset();
				}
			});
			this.selectedObjectIds = this.selectedObjectIds.filter((id) =>
				id !== targetId
			);
			this.logger.log(`[${this.name}] Target unselected: ${targetId}`);
		}
	}

	public resetTargets() {
		this.selectedObjectIds = [];
		Object.values(this.weaponChannels).forEach((weaponChannel) =>
			weaponChannel.reset()
		);
		this.logger.log(`[${this.name}] Reset all targets`);
	}
}
