import { HttpRoute, WebSocketRoute } from '#src/server/WebServerApplication.ts';
import missionEditorRouter from './missionEditorRouter.ts';
import samRouter from './samRouter.ts';

const router: (HttpRoute | WebSocketRoute)[] = [
	...missionEditorRouter,

	...samRouter,
];

export default router;
