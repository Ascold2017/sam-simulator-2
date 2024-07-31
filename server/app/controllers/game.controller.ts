import { Server, Socket } from "socket.io";
import { Request, Response } from "express";
import gameService from "../services/game";
import _ from "lodash";
import {
    captureTargetSchema,
    enableRadarSchema,
    fireTargetSchema,
    resetTargetSchema,
} from "../validators/game.validators";
import type {
    GetCurrentMissionResponse,
    PostRadarEnabledPayload,
    RadarEnabledResponse,
    RadarUpdateResponse,
} from "@shared/models/game.model";

class GameController {
    registerSocketHandlers(socket: Socket, io: Server) {
        socket.on("disconnect", () => {
            gameService.offRadarUpdate(radarUpdateListener);
            gameService.offRadarEnabled(radarEnabledListener);
            if (io.engine.clientsCount === 0) {
                console.log("All users disconnected.");
                gameService.stopMission();
            }
        });

        const radarUpdateListener = (radarUpdate: RadarUpdateResponse) => {
            socket.emit("radarUpdates", radarUpdate);
        };
        const radarEnabledListener = (radarEnabled: RadarEnabledResponse) => {
            socket.emit("radarEnabled", radarEnabled);
        };
        gameService.onRadarUpdate(radarUpdateListener);
        gameService.onRadarEnabled(radarEnabledListener);
    }

    async postLauchMission(req: Request, res: Response) {
        try {
            await gameService.launchMission(+req.params.id);
            res.json({ ok: true });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async getCurrentMission(req: Request, res: Response) {
        const data = gameService.getCurrentMission();
        if (!data) {
            res.status(400).json({ error: "Mission not launched" });
            return;
        }

        res.json(data as GetCurrentMissionResponse);
    }

    async postRadarEnabled(req: Request, res: Response) {
        const result = enableRadarSchema.safeParse(
            req.body as PostRadarEnabledPayload,
        );
        if (!result.success) {
            res.status(400).json({ error: "Invalid data for enableRadar" });
            return;
        }

        const radarGameId = result.data.radarGameId;
        const value = result.data.value;

        gameService.setIsEnabledRadar(radarGameId, value);
        res.json({ ok: true });
    }

    async postStopMission(req: Request, res: Response) {
        gameService.stopMission();
        res.json({ ok: true });
    }

    postCaptureTarget(req: Request, res: Response) {
        const result = captureTargetSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(422).json({ errors: result.error.errors });
        }
        const { weaponGameId, azimuth, elevation, distance } = result.data;
        gameService.captureTarget(weaponGameId, azimuth, elevation, distance);
        res.json({ ok: true });
    }

    postResetTarget(req: Request, res: Response) {
        const result = resetTargetSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(422).json({ errors: result.error.errors });
        }
        const { weaponGameId } = result.data;
        gameService.resetTarget(weaponGameId);
        res.json({ ok: true });
    }

    postLaunchWeapon(req: Request, res: Response) {
        const result = fireTargetSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(422).json({ errors: result.error.errors });
        }
        const { weaponGameId, method } = result.data;
        // @ts-ignore
        gameService.fire(weaponGameId, method)
    }
}

export const gameController = new GameController();
