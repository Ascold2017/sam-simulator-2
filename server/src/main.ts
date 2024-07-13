import Engine from './core/Engine/Engine.ts';
import { SAM } from './core/SAM/SAM.ts';
import WebServerApplication from './server/WebServerApplication.ts';
import router from '#src/server/router/router.ts';
export const engineInstance = new Engine();
export const samInstance = new SAM(engineInstance);

const webServer = new WebServerApplication(3000, router);
