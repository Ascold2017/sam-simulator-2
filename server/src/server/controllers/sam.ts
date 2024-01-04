import { EventEmitter } from 'https://deno.land/x/eventemitter@1.2.4/mod.ts';
import { engineInstance, samInstance } from '#src/main.ts';
import missions from '#src/assets/missions.json' with { type: 'json' };
import samParams from '#src/assets/samParams.json' with { type: 'json' };
import RadarObjectDTO from '#src/server/dto/RadarObjectDTO.ts';
import MissileChannelDTO from '#src/server/dto/MissileChannelDTO.ts';

const ee = new EventEmitter<{
	shouldUpdateSelectedTargetIds(): void;
	shouldUpdateMissileChannels(): void;
}>();

export function getSAMSettings() {
	return new Response(JSON.stringify(samParams));
}

export async function startMission(req: Request) {
	try {
		const { id } = await req.json();
		const mission = missions.find((m) => m.id === id);
		const missionData = JSON.parse(mission!.data);
		engineInstance.startMission(missionData);
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}

export async function selectTarget(req: Request) {
	try {
		const { id } = await req.json();
		id && samInstance.selectTarget(id);
		ee.emit('shouldUpdateSelectedTargetIds');
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}

export async function unselectTarget(req: Request) {
	try {
		const { id } = await req.json();
		id && samInstance.unselectTarget(id);
		ee.emit('shouldUpdateSelectedTargetIds');
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}

export async function resetTargets() {
	try {
		samInstance.resetTargets();
		ee.emit('shouldUpdateSelectedTargetIds');
		ee.emit('shouldUpdateMissileChannels');
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}

export async function launchMissile(req: Request) {
	try {
		const { id, channelId, method } = await req.json();
		samInstance.launchMissile(id, channelId, method);
		ee.emit('shouldUpdateMissileChannels');
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}

export async function resetMissile(req: Request) {
	try {
		const { channelId } = await req.json();
		samInstance.resetMissile(channelId);
		ee.emit('shouldUpdateMissileChannels');
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}

export function socket(socket: WebSocket) {
	socket.onopen = () => {
		console.log('socket opened');
	};
	socket.onmessage = (e) => {};
	socket.onerror = (e) => console.log('socket errored:', e);
	socket.onclose = () => console.log('socket closed');

	ee.on('shouldUpdateSelectedTargetIds', () => {
		socket.send(
			`SELECTED_TARGET_IDS_UPDATE|${
				JSON.stringify(samInstance.getSelectedObjectIds())
			}`,
		);
	});
	ee.on('shouldUpdateMissileChannels', () => {
		const missileChannels = samInstance.getMissileChannels().map((mc) =>
			new MissileChannelDTO(mc)
		);
		socket.send(
			`MISSILE_CHANNELS_UPDATE|${JSON.stringify(missileChannels)}`,
		);
		socket.send(`MISSILES_LEFT_UPDATE|${samInstance.getMissilesCount()}`);
	});

	engineInstance.addFixedLoop('socketUpdate', () => {
		const radarObjects = samInstance.getRadarObjects().map((ro) =>
			new RadarObjectDTO(ro)
		);
		socket.send(
			`RADAR_OBJECTS_UPDATE|${JSON.stringify(radarObjects)}`,
		);
		ee.emit('shouldUpdateMissileChannels');
	}, Number(samParams['RADAR_UPDATE_INTERVAL']));
}
