import { Engine } from './core/Engine/Engine.ts';
import { Server } from '#src/server/index.ts';
import gameService from './services/game.ts';
import { dbClient } from '#src/database/dbClient.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";
import migationInit from '#src/database/migation-init.js';

export const engineInstance = new Engine();
await dbClient.connect();
await dbClient.clearTables()
await dbClient.initializeDatabase();

dbClient.migrateData('initial_migration', migationInit);

//gameService.startMission(1)