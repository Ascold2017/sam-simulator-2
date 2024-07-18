import { Request, Response } from "express";
import { DI } from "../config/dataSource";
import { MissionDTO } from "../dto/mission.dto";

class MissionController {

    async getMissions(req: Request, res: Response) {

        const data = await DI.mission.find();
        const parsedData = data.map(m => new MissionDTO(m));

        res.json(parsedData)
    }
}

export const missionController = new MissionController()