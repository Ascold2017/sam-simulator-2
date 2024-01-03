import Engine from './core/Engine/Engine.ts';
import { SAM } from './core/SAM/SAM.ts';

const engine = new Engine();
const sam = new SAM(engine);

const conn = Deno.listen({ port: 8001 });
const httpConn = Deno.serveHttp(await conn.accept());
const e = await httpConn.nextRequest();
if (e) {
	e.respondWith(new Response('Hello World'));
}
/*
TODO

HTTP:
GET /missions
GET /flight-object-types
GET /sam-settings

POST /select-target
POST /unselect-target
POST /reset-targets
POST /launch-missile
POST /reset-missile

WS:
RADAR_OBJECTS_UPDATE
SELECTED_TARGET_IDS_UPDATE
MISSILE_CHANNELS_UPDATE
MISSILES_LEFT_UPDATE
*/
