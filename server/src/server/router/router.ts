import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';
import { getMissions, startMission } from '#src/server/controllers/missions.ts';
import { getFlightObjectTypes } from '#src/server/controllers/editor.ts';
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
				const file = Deno.openSync('./public/index.html', {
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
		path: '/missions',
		handler: getMissions,
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
