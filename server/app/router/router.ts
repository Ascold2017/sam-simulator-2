import { Router } from 'express';
import { missionController } from '../controllers/mission.controller';

const router = Router();

router.get('/missions', missionController.getMissions)

export default router;
