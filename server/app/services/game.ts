import MissionLogger from "../../core/MissionLogger";
import { Radar } from "../../core/Radar";
import { SAM } from "../../core/SAM";
import { EnvironmentRadarDTO, EnvironmentSAMDTO } from "../dto/environment.dto";
import { MissionTaskDTO } from "../dto/missionTask.dto";
import { DI } from "../config/dataSource";
import { engineInstance } from "../main";

interface GameRadar {
    id: number;
    entity: Radar;
}

interface GameSAM {
    id: number;
    entity: SAM;
}

class GameService {
    private radars: GameRadar[] = [];
    private sams: GameSAM[] = [];
    private logger = new MissionLogger();

    public async startMission(missionId: number) {
        const mission = await DI.mission.findOneOrFail({
            where: { id: missionId },
            relations: [
                "tasks",
                "tasks.flightObjectType",
                "environments",
                "environments.radar",
                "environments.weapon",
            ],
        });

        if (mission) {
            
            engineInstance.resetMission();
            engineInstance.startMission(
                mission.tasks.map((task) => new MissionTaskDTO(task)),
            );

            mission.environments.forEach((environment) => {
                if (environment.type === "radar") {
                    this.radars.push({
                        id: environment.id,
                        entity: new Radar(
                            new EnvironmentRadarDTO(
                                engineInstance,
                                this.logger,
                                environment,
                            ),
                        ),
                    });
                }
                if (environment.type === "sam") {
                    this.sams.push({
                        id: environment.id,
                        entity: new SAM(
                            new EnvironmentSAMDTO(
                                engineInstance,
                                this.logger,
                                environment,
                            ),
                        ),
                    });
                }
            });
        }
    }

    public getLogs() {
        return this.logger.getLogs();
    }

    public stop() {
        engineInstance.resetMission();
        this.radars = [];
        this.sams = [];
        this.logger = new MissionLogger();
    }

    public setIsEnabledRadar(radarId: number, value: boolean) {
        this.radars.find(r => r.id === radarId).entity.setIsEnabled(value);
    }

    public setIsEnabledSAM(radarId: number, value: boolean) {
        this.sams.find(r => r.id === radarId).entity.radar.setIsEnabled(value);
    }
}

const gameService = new GameService();

export default gameService;
