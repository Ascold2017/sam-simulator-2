import { Router } from 'express';
import { missionController } from '../controllers/mission.controller';
import { gameController } from '../controllers/game.controller';

const router = Router();

// MISSIONS CRUD
router.get('/missions', missionController.getMissions)
router.get('/missions/:id', missionController.getMissionById)
router.post('/missions', missionController.postMission)
router.put('/missions/:id', missionController.putMission)
router.delete('/missions/:id', missionController.deleteMission)

// GAME
router.post('/game/launch-mission/:id', gameController.postLauchMission)
router.get('/game/current-mission', gameController.getCurrentMission)
router.post('/game/radar-enabled', gameController.postRadarEnabled)
router.post('/game/stop-mission', gameController.postStopMission)

export default router;
