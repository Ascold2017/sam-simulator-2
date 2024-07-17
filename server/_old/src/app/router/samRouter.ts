import { Router } from '#src/server/index.ts';
import { startMission } from '../controllers/editor.ts';
import {
	getLogs,
	getSAMSettings,
	launchMissile,
	resetMissile,
	resetTargets,
	selectTarget,
	socket,
	unselectTarget,
} from '../controllers/sam.ts';

const router = new Router('/sam');

router.addRoute({
	type: 'http',
	path: '/settings',
	handler: getSAMSettings,
});

router.addRoute({
	type: 'http',
	path: '/start',
	handler: startMission,
});

router.addRoute({
	type: 'http',
	path: '/select-target',
	handler: selectTarget,
});

router.addRoute({
	type: 'http',
	path: '/reset-targets',
	handler: resetTargets,
});

router.addRoute({
	type: 'http',
	path: '/unselect-target',
	handler: unselectTarget,
});

router.addRoute({
	type: 'http',
	path: '/launch-missile',
	handler: launchMissile,
});

router.addRoute({
	type: 'http',
	path: '/reset-missile',
	handler: resetMissile,
});

router.addRoute({
	type: 'websocket',
	path: '/socket',
	handler: socket,
});

router.addRoute({
	type: 'http',
	path: '/logs',
	handler: getLogs,
});

export default router;
