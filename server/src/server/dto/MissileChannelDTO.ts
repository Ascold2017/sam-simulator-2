import { MissileChannel } from '#src/core/SAM/SAM.ts';

export default class MissileChannelDTO {
	public id: number;
	public isBusy: boolean;
	constructor(missileChannel: MissileChannel) {
		this.id = missileChannel.id;
		this.isBusy = !!missileChannel.missile;
	}
}
