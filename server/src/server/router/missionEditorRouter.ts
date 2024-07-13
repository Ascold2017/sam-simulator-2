import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';
import {
	getFlightObjectTypes,
	getMissions,
	saveMission,
} from '#src/server/controllers/editor.ts';

const router: (HttpRoute | WebSocketRoute)[] = [
	{
		type: 'http',
		path: '/api/missions',
		handler: getMissions,
	},

	{
		type: 'http',
		path: '/api/save-mission',
		handler: saveMission,
	},
	{
		type: 'http',
		path: '/api/flight-object-types',
		handler: getFlightObjectTypes,
	},
];

export default router;
