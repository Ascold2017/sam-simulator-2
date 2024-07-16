import { Radar } from '#src/core/Radar/index.ts';
import { Weapon } from '#src/core/Weapon/index.ts';
import EventEmitter from 'https://deno.land/x/eventemitter@1.2.4/mod.ts';
import MissionLogger from '#src/core/MissionLogger.ts';
import MissionDTO, { MissionRow } from '#src/app/dto/MissionDTO.ts';
import { dbClient } from '../../database/dbClient.ts';
import { engineInstance } from '#src/main.ts';
import { MissionEntity } from '#src/app/models/mission.model.ts';
import { SAM } from '#src/core/SAM/index.ts';

class GameService {
    private ee = new EventEmitter<{
        shouldUpdateSelectedTargetIds(): void;
        shouldUpdateMissileChannels(): void;
    }>();
    private radars: Radar[] = [];
    private sams: SAM[] = [];
    private logger = new MissionLogger();

    public async startMission(missionId: number) {
        const mission = await dbClient.findOne<MissionEntity>('missions', {
            id: missionId,
        });

        if (mission) {
            engineInstance.resetMission();
            engineInstance.startMission(mission.tasks);

            mission.environment.forEach((environment) => {
                const commonParams = {
                    name: environment.name,
                    position: environment.position,
                    engine: engineInstance,
                    logger: this.logger,
                };
                if (environment.type === 'radar') {
                    this.radars.push(
                        new Radar({
                            ...commonParams,
                        }),
                    );
                }
                if (environment.type === 'sam') {
                    this.sams.push(
                        new SAM({
                            ...commonParams,
                        }),
                    );
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
}

const gameService = new GameService();

export default gameService;
