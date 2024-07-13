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
		path: '/api/sam-settings',
		handler: getSAMSettings,
	},
	{
		type: 'http',
		path: '/api/start',
		handler: startMission,
	},
	{
		type: 'http',
		path: '/api/select-target',
		handler: selectTarget,
	},
	{
		type: 'http',
		path: '/api/unselect-target',
		handler: unselectTarget,
	},
	{
		type: 'http',
		path: '/api/reset-targets',
		handler: resetTargets,
	},
	{
		type: 'http',
		path: '/api/launch-missile',
		handler: launchMissile,
	},
	{
		type: 'http',
		path: '/api/reset-missile',
		handler: resetMissile,
	},
	{
		type: 'websocket',
		path: '/api/socket',
		handler: socket,
	},
	{
		type: 'http',
		path: '/api/logs',
		handler: getLogs,
	},
];

export default router;
