import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';
import { startMission } from '#src/server/controllers/editor.ts';
import {
	getLogs,
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
	{
		type: 'http',
		path: '/logs',
		handler: getLogs,
	},
];

export default router;
