import { EventEmitter } from 'https://deno.land/x/eventemitter@1.2.4/mod.ts';
import { engineInstance, samInstance } from '#src/main.ts';
import samParams from '#src/assets/samParams.json' with { type: 'json' };
import RadarObjectDTO from '../dto/RadarObjectDTO.ts';
import MissileChannelDTO from '../dto/MissileChannelDTO.ts';
import MissionLogger from '#src/core/MissionLogger.ts';

const ee = new EventEmitter<{
	shouldUpdateSelectedTargetIds(): void;
	shouldUpdateMissileChannels(): void;
}>();

export function getSAMSettings() {
	return new Response(JSON.stringify(samParams));
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

export function resetTargets() {
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

export async function getLogs(req: Request) {
	const logger = new MissionLogger();
	return new Response(JSON.stringify(logger.getLogs()));
}

let activeSocketsCount = 0;
export function socket(socket: WebSocket) {
	socket.onopen = () => {
		console.log('socket opened');
		activeSocketsCount++;
		samInstance.setIsEnabled(true);
		updateRadarObjectsAndMissileChannels();
	};
	socket.onmessage = (e) => {};
	socket.onerror = (e) => console.log('socket errored:', e);
	socket.onclose = () => {
		activeSocketsCount--;
		if (activeSocketsCount <= 0) {
			activeSocketsCount = 0;
			samInstance.setIsEnabled(false);
		}
		console.log('socket closed');
	};

	ee.on('shouldUpdateSelectedTargetIds', () => {
		if (socket.readyState !== socket.OPEN) return;
		socket.send(
			`SELECTED_TARGET_IDS_UPDATE|${
				JSON.stringify(samInstance.getSelectedObjectIds())
			}`,
		);
	});
	ee.on('shouldUpdateMissileChannels', () => {
		if (socket.readyState !== socket.OPEN) return;
		const missileChannels = samInstance.getMissileChannels().map((mc) =>
			new MissileChannelDTO(mc)
		);
		socket.send(
			`MISSILE_CHANNELS_UPDATE|${JSON.stringify(missileChannels)}`,
		);
		socket.send(`MISSILES_LEFT_UPDATE|${samInstance.getMissilesCount()}`);
	});

	function updateRadarObjectsAndMissileChannels() {
		const radarObjects = samInstance.getRadarObjects().map((ro) =>
			new RadarObjectDTO(ro)
		);
		socket.send(
			`RADAR_OBJECTS_UPDATE|${JSON.stringify(radarObjects)}`,
		);

		ee.emit('shouldUpdateMissileChannels');
	}

	engineInstance.addFixedLoop('socketUpdate', () => {
		if (socket.readyState === socket.OPEN) {
			updateRadarObjectsAndMissileChannels();
		}
	}, Number(samParams['RADAR_UPDATE_INTERVAL']));
}
