import { Router } from '#src/server/index.ts';
import editorRouter from './missionEditorRouter.ts';
import samRouter from './samRouter.ts';

const router = new Router('/api')

router.addRouter(samRouter)
router.addRouter(editorRouter)

export default router;
