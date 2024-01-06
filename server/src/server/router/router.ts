import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';
import clientRouter from './clientRouter.ts';
import missionEditorRouter from './missionEditorRouter.ts';
import samRouter from './samRouter.ts';

const router: (HttpRoute | WebSocketRoute)[] = [
	...clientRouter,

	...missionEditorRouter,

	...samRouter,
];

export default router;
