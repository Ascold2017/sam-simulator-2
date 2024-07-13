import Engine from './core/Engine/Engine.ts';
import { SAM } from './core/SAM/SAM.ts';
import { Server } from '#src/server/index.ts';
import router from './app/router/index.ts';
export const engineInstance = new Engine();
export const samInstance = new SAM(engineInstance);

const webServer = new Server(3000, router);
