import { Engine } from './core/Engine/Engine.ts';
import { Server } from '#src/server/index.ts';
import router from './app/router/index.ts';

export const engineInstance = new Engine();

const webServer = new Server(3000, router);
