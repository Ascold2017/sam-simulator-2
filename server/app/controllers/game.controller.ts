import { Server, Socket } from "socket.io";
import gameService from "../services/game";
import { z } from "zod";
import _ from 'lodash'
import { RadarObject } from "../../core";
import { RadarObjectDTO } from "../dto/radarObject.dto";
import { RadarUpdatePayload } from "../types/game-service";

// Схемы валидации
const loadMissionSchema = z.object({
    id: z.number(),
});

const enableRadarSchema = z.object({
    id: z.number(),
    value: z.boolean(),
});

export class GameController {

    static emitRadarUpdates(socket: Socket) {
        const radarUpdateListener = (radarUpdate: RadarUpdatePayload) =>  {
            socket.emit("radarUpdates", radarUpdate); 
        }
        gameService.onRadarUpdate(radarUpdateListener);

        socket.on("disconnect", () => {
            gameService.offRadarUpdate(radarUpdateListener);
        });
    }

    public registerHandlers(io: Server, socket: Socket) {
        socket.on("loadMission", (data) => this.handleLoadMission(socket, data));
        socket.on("enableRadar", (data) => this.handleRadarEnabled(socket, data));
    }

    async handleLoadMission(socket: Socket, data: any) {
        const result = loadMissionSchema.safeParse(data);
        if (!result.success) {
            socket.emit("error", "Invalid data for loadMission");
            return;
        }
        const missionId = result.data.id;
        await gameService.loadMission(missionId);
        const environments = gameService.getEnvironments();

        socket.emit("loadMission", environments);
        socket.broadcast.emit("loadMission", environments);
    }

    handleRadarEnabled(socket: Socket, data: any) {
        const result = enableRadarSchema.safeParse(data);
        if (!result.success) {
            socket.emit("error", "Invalid data for enableRadar");
            return;
        }

        const radarId = result.data.id;
        const value = result.data.value;

        gameService.setIsEnabledRadar(radarId, value);
        socket.emit("enableRadar", {
            radarId,
            value: !value,
        });
    }
}
