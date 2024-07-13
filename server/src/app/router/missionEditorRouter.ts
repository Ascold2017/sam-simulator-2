import { Router } from '#src/server/index.ts';
import {
	getFlightObjectTypes,
	getMissions,
	saveMission,
} from '../controllers/editor.ts';

const router = new Router('/editor');

router.addRoute(
	{
		type: 'http',
		path: '/missions',
		handler: getMissions,
	},
);

router.addRoute(
	{
		type: 'http',
		path: '/save-mission',
		handler: saveMission,
	},
);

router.addRoute(
	{
		type: 'http',
		path: '/flight-object-types',
		handler: getFlightObjectTypes,
	},
);

export default router;
