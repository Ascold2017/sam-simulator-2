import { Client } from 'https://deno.land/x/postgres/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

const env = config(); // Загружаем переменные из .env файла

class DatabaseClient {
    private client: Client;

    constructor() {
        this.client = new Client(env.DB_URI);
    }

    async connect() {
        await this.client.connect();
        console.log('Database connected')
    }

    async disconnect() {
        await this.client.end();
    }

    async initializeDatabase() {
        const initSql = await Deno.readTextFileSync('./src/database/init.sql');
        await this.client.queryArray(initSql);
        console.log('Database initialized')
    }

    async clearTables() {
        // Очистка данных из всех таблиц, кроме таблицы migrations
        const tablesToClear = ['migrations', 'Environment',  'SAM', 'Radar',  'MissionFlightTask', 'FlightObjectType', 'Mission'];
        for (const table of tablesToClear) {
            await this.client.queryArray(`DROP TABLE IF EXISTS ${table}`);
        }
        console.log('Database cleared')
    }

    async migrateData(migrationName: string, jsonData: any) {
        const result = await this.client.queryArray(
            `SELECT COUNT(*) FROM migrations WHERE migration_name = $1`,
            [migrationName], // передаем параметр как массив
        );
        
        // @ts-ignore
        const count = parseInt(result.rows[0][0].toString(), 10);
        
        if (count > 0) {
            console.log(`Migration "${migrationName}" has already been applied.`);
            return;
        }
    
        for (const table in jsonData) {
            for (const row of jsonData[table]) {
                const columns = Object.keys(row).join(", ");
                const values = Object.values(row)
                    .map((value: any) => `'${JSON.stringify(value).replace(/'/g, "''")}'`)
                    .join(", ");
                await this.client.queryArray(`INSERT INTO ${table} (${columns}) VALUES (${values})`);
            }
        }
    
        await this.client.queryArray(
            `INSERT INTO migrations (migration_name) VALUES ($1)`,
            [migrationName], // передаем параметр как массив
        );
    
        console.log(`Migration "${migrationName}" has been successfully applied.`);
    }
}

export const dbClient = new DatabaseClient();


