import { Engine } from './core/Engine/Engine.ts';
import { Server } from '#src/server/index.ts';
import router from './app/router/index.ts';
import { Radar } from '#src/core/Radar/index.ts';
import MissionLogger from '#src/core/MissionLogger.ts';
import gameService from '#src/app/services/game.ts';

export const engineInstance = new Engine();

setTimeout(() => {
    gameService.startMission(1)
}, 2000)
