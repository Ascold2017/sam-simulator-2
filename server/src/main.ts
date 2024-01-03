import Engine from './core/Engine/Engine.ts';
import { SAM } from './core/SAM/SAM.ts';
import HttpServer from '#src/server/HttpServer.ts';
import MISSIONS from '#src/assets/MISSIONS.ts';
import FLIGHT_OBJECT_TYPES from '#src/assets/FLIGHT_OBJECT_TYPES.ts';
import { load } from 'https://deno.land/std@0.210.0/dotenv/mod.ts';

const env = await load();

const engine = new Engine();
const sam = new SAM(engine);

const httpServer = new HttpServer(8001);

httpServer.addEndpoint('/missions', async (ctx) => {
	await ctx.respondWith(new Response(JSON.stringify(MISSIONS)));
});

httpServer.addEndpoint('/flight-object-types', async (ctx) => {
	await ctx.respondWith(new Response(JSON.stringify(FLIGHT_OBJECT_TYPES)));
});

httpServer.addEndpoint('/sam-settings', async (ctx) => {
	await ctx.respondWith(new Response(JSON.stringify(env)));
});

httpServer.addEndpoint('/select-target', async (ctx) => {
	//await ctx.respondWith(new Response(JSON.stringify(env)));
});

httpServer.addEndpoint('/unselect-target', async (ctx) => {
	//await ctx.respondWith(new Response(JSON.stringify(env)));
});

httpServer.addEndpoint('/reset-targets', async (ctx) => {
	//await ctx.respondWith(new Response(JSON.stringify(env)));
});

httpServer.addEndpoint('/launch-missile', async (ctx) => {
	//await ctx.respondWith(new Response(JSON.stringify(env)));
});

httpServer.addEndpoint('/reset-missile', async (ctx) => {
	//await ctx.respondWith(new Response(JSON.stringify(env)));
});

/*
TODO

WS:
RADAR_OBJECTS_UPDATE
SELECTED_TARGET_IDS_UPDATE
MISSILE_CHANNELS_UPDATE
MISSILES_LEFT_UPDATE
*/
