import { Router } from 'express';
import { missionController } from '../controllers/mission.controller';

const router = Router();

router.get('/missions', missionController.getMissions)
router.post('/missions', missionController.postMission)
router.put('/missions/:id', missionController.putMission)
router.delete('/missions/:id', missionController.deleteMission)

export default router;
