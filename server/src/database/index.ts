import { DatabaseClient } from '#src/database/dbClient.ts';
import { config } from "https://deno.land/x/dotenv/mod.ts";
// Загрузка переменных окружения из .env файла
config({ export: true });

const dbUri = Deno.env.get("DB_URI")
export const dbClient = new DatabaseClient(dbUri!);

