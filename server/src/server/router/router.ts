import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';
import {
	getFlightObjectTypes,
	getMissions,
	saveMission,
	startMission,
} from '#src/server/controllers/editor.ts';
import {
	getSAMSettings,
	launchMissile,
	resetMissile,
	resetTargets,
	selectTarget,
	socket,
	unselectTarget,
} from '#src/server/controllers/sam.ts';

const router: (HttpRoute | WebSocketRoute)[] = [
	{
		type: 'http',
		path: '/',
		handler: async (req) => {
			try {
				const file = Deno.openSync('../client/dist/index.html', {
					read: true,
				});
				return new Response(file.readable);
			} catch (e) {
				console.log(e);
				// If the file cannot be opened, return a "404 Not Found" response
				return new Response('404 Not Found', { status: 404 });
			}
		},
	},
	{
		type: 'http',
		path: '/assets/:filename',
		handler: async (req, { params }) => {
			const ext = params.filename?.split('.').slice(-1)[0]!;

			const contentTypes = {
				'js': 'application/javascript',
				'css': 'text/css',
				'ogg': 'audio/ogg',
				'mp3': 'audio/mpeg',
			};

			try {
				const file = Deno.openSync(
					'../client/dist/assets/' + params.filename,
					{
						read: true,
					},
				);
				return new Response(file.readable, {
					headers: { 'Content-type': contentTypes[ext] || '' },
				});
			} catch (e) {
				console.log(e);
				// If the file cannot be opened, return a "404 Not Found" response
				return new Response('404 Not Found', { status: 404 });
			}
		},
	},
	{
		type: 'http',
		path: '/fonts/:filename',
		handler: async (req, { params }) => {
			try {
				const file = Deno.openSync(
					'../client/dist/fonts/' + params.filename,
					{
						read: true,
					},
				);
				return new Response(file.readable);
			} catch (e) {
				console.log(e);
				// If the file cannot be opened, return a "404 Not Found" response
				return new Response('404 Not Found', { status: 404 });
			}
		},
	},

	{
		type: 'http',
		path: '/missions',
		handler: getMissions,
	},

	{
		type: 'http',
		path: '/save-mission',
		handler: saveMission,
	},
	{
		type: 'http',
		path: '/flight-object-types',
		handler: getFlightObjectTypes,
	},
	{
		type: 'http',
		path: '/sam-settings',
		handler: getSAMSettings,
	},
	{
		type: 'http',
		path: '/start',
		handler: startMission,
	},
	{
		type: 'http',
		path: '/select-target',
		handler: selectTarget,
	},
	{
		type: 'http',
		path: '/unselect-target',
		handler: unselectTarget,
	},
	{
		type: 'http',
		path: '/reset-targets',
		handler: resetTargets,
	},
	{
		type: 'http',
		path: '/launch-missile',
		handler: launchMissile,
	},
	{
		type: 'http',
		path: '/reset-missile',
		handler: resetMissile,
	},
	{
		type: 'websocket',
		path: '/socket',
		handler: socket,
	},
];

export default router;
