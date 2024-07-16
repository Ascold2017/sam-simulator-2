import { Engine } from './core/Engine/Engine.ts';
import { Server } from '#src/server/index.ts';
import gameService from '#src/app/services/game.ts';
import { dbClient } from '#src/database/dbClient.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";
// Загрузка переменных окружения из .env файла
config({ export: true });

const dbUri = Deno.env.get("DB_URI")

export const engineInstance = new Engine();

await dbClient.connect(dbUri!)
await dbClient.initializeDatabase({
    missions: './src/initData/missions.json',
    flightObjectType: './src/initData/flightObjectTypes.json'
})

gameService.startMission(1)