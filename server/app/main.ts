import "reflect-metadata";
import express from "express";
import { AppDataSource, DI } from "./config/dataSource";
import { Engine } from "../core";
import gameService from "./services/game";

export const engineInstance = new Engine()
//gameService.startMission(1)

const port = process.env.PORT || 8000;
AppDataSource.initialize()
    .then(() => {
        console.log("Migrations: ", AppDataSource.migrations);
        return AppDataSource.runMigrations();
    })
    .then(async () => {
        const app = express();
        app.use(express.json());

        const data = await gameService.loadMission(1)
        gameService.setIsEnabledRadar(1, false)
        gameService.onRadarUpdate(console.log)

        app.listen(port, () => {
            console.log(`Server is Fire at http://localhost:${port}`);
        });
    })
    .catch(console.error);
