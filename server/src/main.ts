import Engine from './core/Engine/Engine.ts';
import { SAM } from './core/SAM/SAM.ts';
import WebServer from './server/WebServer.ts';
import MISSIONS from '#src/assets/MISSIONS.ts';
import FLIGHT_OBJECT_TYPES from '#src/assets/FLIGHT_OBJECT_TYPES.ts';
import { load } from 'https://deno.land/std@0.210.0/dotenv/mod.ts';

const env = await load();

const engine = new Engine();
const sam = new SAM(engine);

const webServer = new WebServer(8001);

webServer.addEndpoint('/missions', () => {
	return new Response(JSON.stringify(MISSIONS));
});

webServer.addEndpoint('/flight-object-types', () => {
	return new Response(JSON.stringify(FLIGHT_OBJECT_TYPES));
});

webServer.addEndpoint('/sam-settings', (req) => {
	return new Response(JSON.stringify(env));
});

webServer.addEndpoint('/start', async (req) => {
	try {
		const { id } = await req.json();
		const mission = MISSIONS.find((m) => m.id === id);
		const missionData = JSON.parse(mission!.data);
		engine.startMission(missionData);
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
});

webServer.addEndpoint('/select-target', async (req) => {
	try {
		const payload = await req.json();
		const { id } = JSON.parse(payload);
		id && sam.selectTarget(id);
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
});

webServer.addEndpoint('/unselect-target', async (req) => {
	try {
		const payload = await req.json();
		const { id } = JSON.parse(payload);
		id && sam.unselectTarget(id);
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
});

webServer.addEndpoint('/reset-targets', () => {
	try {
		sam.resetTargets();
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
});

webServer.addEndpoint('/launch-missile', async (req) => {
	try {
		const payload = await req.json();
		const { id, channelId, method } = JSON.parse(payload);
		sam.launchMissile(id, channelId, method);
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
});

webServer.addEndpoint('/reset-missile', async (req) => {
	try {
		const payload = await req.json();
		const { channelId } = JSON.parse(payload);
		sam.resetMissile(channelId);
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
});

webServer.addSocketEndpoint('/socket', (socket) => {
	socket.onopen = () => {
		console.log('socket opened');
	};
	socket.onmessage = (e) => {};
	socket.onerror = (e) => console.log('socket errored:', e);
	socket.onclose = () => console.log('socket closed');

	engine.addFixedLoop('socketUpdate', () => {
		socket.send(
			`RADAR_OBJECTS_UPDATE|${JSON.stringify(sam.getRadarObjects())}`,
		);
	}, Number(env['RADAR_UPDATE_INTERVAL']));
});

/*
TODO

WS:
SELECTED_TARGET_IDS_UPDATE
MISSILE_CHANNELS_UPDATE
MISSILES_LEFT_UPDATE
*/
