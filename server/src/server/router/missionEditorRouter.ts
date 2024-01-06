import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';
import {
	getFlightObjectTypes,
	getMissions,
	saveMission,
} from '#src/server/controllers/editor.ts';

const router: (HttpRoute | WebSocketRoute)[] = [
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
];

export default router;
