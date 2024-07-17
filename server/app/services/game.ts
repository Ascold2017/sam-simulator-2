import MissionLogger from "../../core/MissionLogger";
import { Radar } from "../../core/Radar";
import { SAM } from "../../core/SAM";
import { EnvironmentRadarDTO, EnvironmentSAMDTO } from "../dto/environment.dto";
import { MissionTaskDTO } from "../dto/missionTask.dto";
import { DI } from "../config/dataSource";
import { engineInstance } from "../main";



class GameService {
    private radars: Radar[] = [];
    private sams: SAM[] = [];
    private logger = new MissionLogger();

    public async startMission(missionId: number) {
        const mission = await DI.mission.findOneOrFail({
            where: { id: missionId },
            relations: [
                'tasks',
                'tasks.flightObjectType',
                'environments',
                'environments.radar',
                'environments.weapon',
            ]
        })
        

        if (mission) {
            engineInstance.resetMission();
            engineInstance.startMission(mission.tasks.map(task => new MissionTaskDTO(task)));

            
            mission.environments.forEach((environment) => {
                if (environment.type === 'radar') {
                    this.radars.push(
                        new Radar(new EnvironmentRadarDTO(engineInstance, this.logger, environment)),
                    );
                }
                if (environment.type === 'sam') {
                    this.sams.push(
                        new SAM(new EnvironmentSAMDTO(engineInstance, this.logger, environment)),
                    );
                }
            });

            console.log(this.radars, this.sams)
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
}

const gameService = new GameService();

export default gameService;
