import { Server, Socket } from "socket.io";
import gameService from "../services/game";
import _ from 'lodash'
import { RadarUpdatePayload } from "../types/game-service";
import { loadMissionSchema, enableRadarSchema } from "../validators/game.validators";

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
        const mission = await gameService.loadMission(missionId);
        const { radars, sams } = gameService.getEnvironments();

        const payload = {
            mission,
            radars,
            sams
        }
        socket.emit("loadMission", payload);
        socket.broadcast.emit("loadMission", payload);
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
            value,
        });
    }
}
