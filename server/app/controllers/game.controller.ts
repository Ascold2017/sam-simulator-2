import { Server, Socket } from "socket.io";
import { Request, Response } from "express";
import gameService from "../services/game";
import _ from 'lodash'
import { RadarUpdatePayload } from "../types/game-service";
import { enableRadarSchema } from "../validators/game.validators";
import type { GetCurrentMissionResponse, PostRadarEnabledPayload } from '@shared/models/game.model'

class GameController {
    registerSocketHandlers(socket: Socket) {

        socket.on("disconnect", () => {
            gameService.offRadarUpdate(radarUpdateListener);
        });

        const radarUpdateListener = (radarUpdate: RadarUpdatePayload) =>  {
            socket.emit("radarUpdates", radarUpdate); 
        }
        gameService.onRadarUpdate(radarUpdateListener);
    }

    async postLauchMission(req: Request, res: Response) {
        await gameService.launchMission(+req.params.id);
        res.json({ ok: true })
    }

    async getCurrentMission(req: Request, res: Response) {
        const data = gameService.getCurrentMission();
        if (!data) {
            res.status(400).json({ error: 'Mission not launched' })
            return;
        }
        
        res.json(data as GetCurrentMissionResponse)
    }

    async postRadarEnabled(req: Request, res: Response) {
        const result = enableRadarSchema.safeParse(req.body as PostRadarEnabledPayload);
        if (!result.success) {
            res.status(400).json({ error: "Invalid data for enableRadar" })
            return;
        }

        const radarId = result.data.radarId;
        const value = result.data.value;

        gameService.setIsEnabledRadar(radarId, value);
        res.json({ ok: true })
    }
}


export const gameController = new GameController();