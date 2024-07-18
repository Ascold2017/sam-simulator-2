import "reflect-metadata";
import http from 'http';
import { AppDataSource } from "./config/dataSource";
import { Engine } from "../core";
import { setupSocketServer } from "./websocket/websocketServer";

export const engineInstance = new Engine()
const server = http.createServer();
const port = process.env.PORT || 3000;

(async () => {
    await AppDataSource.initialize()
    await AppDataSource.runMigrations();
    setupSocketServer(server);
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
