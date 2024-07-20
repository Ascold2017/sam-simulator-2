import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";
import { AppDataSource } from "./config/dataSource";
import { Engine } from "../core";
import { setupSocketServer } from "./websocket/websocketServer";
import router from "./router/router";
import { generateMap } from "./helpers/mapGenerator";

export const engineInstance = new Engine();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json()); // Поддержка JSON-формата
app.use(cors());
app.use("/api", router);

(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    setupSocketServer(server);
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
