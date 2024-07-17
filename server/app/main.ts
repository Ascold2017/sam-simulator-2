import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/dataSource";

//gameService.startMission(1)

const port = process.env.PORT || 8000;
AppDataSource.initialize()
    .then(() => {
        console.log("Migrations: ", AppDataSource.migrations);
        return AppDataSource.runMigrations();
    })
    .then(() => {
        const app = express();
        app.use(express.json());

        app.listen(port, () => {
            console.log(`Server is Fire at http://localhost:${port}`);
        });
    })
    .catch(console.error);
