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
    WeaponCaptureResponse,
    WeaponLaunchedResponse,
    WeaponMoveCursorResponse,
    WeaponUnselectedResponse,
} from "@shared/models/game.model";

class GameController {
    registerSocketHandlers(socket: Socket, io: Server) {
        const radarUpdateListener = (radarUpdate: RadarUpdateResponse) => {
            socket.emit("radarUpdates", radarUpdate);
        };
        const radarEnabledListener = (radarEnabled: RadarEnabledResponse) => {
            socket.emit("radarEnabled", radarEnabled);
        };
        const weaponCaptureListener = (payload: WeaponCaptureResponse) => {
            socket.emit("targetCaptured", payload);
        };
        const weaponUnselectedListener = (
            payload: WeaponUnselectedResponse,
        ) => {
            socket.emit("targetUnselected", payload);
        };
        const weaponFireListener = (payload: WeaponLaunchedResponse) => {
            socket.emit("targetFire", payload);
        };
        const weaponCursorMoveListener = (
            payload: WeaponMoveCursorResponse,
        ) => {
            socket.emit("moveCursor", payload);
        };
        gameService.eventBus.on("radarUpdate", radarUpdateListener);
        gameService.eventBus.on("radarEnabled", radarEnabledListener);
        gameService.eventBus.on("targetCaptured", weaponCaptureListener);
        gameService.eventBus.on("targetUnselected", weaponUnselectedListener);
        gameService.eventBus.on("weaponLaunched", weaponFireListener);
        gameService.eventBus.on("moveCursor", weaponCursorMoveListener);

        socket.on("moveCursor", (data: WeaponMoveCursorResponse) => {
            gameService.moveCursor(data.weaponId, data.azimuth, data.elevation, data.distance)
        });

        socket.on("disconnect", () => {
            gameService.eventBus.off("radarUpdate", radarUpdateListener);
            gameService.eventBus.off("radarEnabled", radarEnabledListener);
            gameService.eventBus.off("targetCaptured", weaponCaptureListener);
            gameService.eventBus.off(
                "targetUnselected",
                weaponUnselectedListener,
            );
            gameService.eventBus.off("weaponLaunched", weaponFireListener);
            gameService.eventBus.off("moveCursor", weaponCursorMoveListener);
            if (io.engine.clientsCount === 0) {
                console.log("All users disconnected.");
                gameService.stopMission();
            }
        });
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
        const { weaponGameId } = result.data;
        gameService.captureTarget(weaponGameId);
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
        gameService.fire(weaponGameId, method);
    }
}

export const gameController = new GameController();
