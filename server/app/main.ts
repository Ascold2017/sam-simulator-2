import "reflect-metadata";
import express from "express";
import { AppDataSource, DI } from "./config/dataSource";

//gameService.startMission(1)

const port = process.env.PORT || 8000;
AppDataSource.initialize()
    .then(() => {
        console.log("Migrations: ", AppDataSource.migrations);
        return AppDataSource.runMigrations();
    })
    .then(async () => {

        const data = await DI.mission.findOne({
            where: { id: 1 },
            relations: {
                tasks: true,
                environments: true
            }
        })

        console.log(data)
        const app = express();
        app.use(express.json());

        app.listen(port, () => {
            console.log(`Server is Fire at http://localhost:${port}`);
        });
    })
    .catch(console.error);
