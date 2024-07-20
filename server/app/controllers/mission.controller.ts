import { Request, Response } from "express";
import { missionService } from "../services/mission";
import { createMissionSchema } from "../validators/mission.validators";
import { CreateMissionPayload } from "../types/mission-service";

class MissionController {
    async getMissions(req: Request, res: Response) {
        const data = await missionService.getMissions();

        res.json(data);
    }

    async postMission(req: Request, res: Response) {
        try {
            const result = createMissionSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(422).json({ errors: result.error.errors });
            }

            const mission = await missionService.createMission(
                result.data as CreateMissionPayload,
            );
            res.status(201).json(mission);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async putMission(req: Request, res: Response) {
        try {
            const result = createMissionSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(422).json({ errors: result.error.errors });
            }

            const mission = await missionService.updateMission(
                +req.params.id,
                result.data as CreateMissionPayload,
            );
            res.status(201).json(mission);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteMission(req: Request, res: Response) {
        try {
            await missionService.deleteMission(
                +req.params.id,
            );
            res.status(201).json({ ok: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const missionController = new MissionController();
