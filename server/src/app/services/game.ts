import { Radar } from '#src/core/Radar/index.ts';
import { Weapon } from '#src/core/Weapon/index.ts';
import EventEmitter from 'https://deno.land/x/eventemitter@1.2.4/mod.ts';
import MissionLogger from '#src/core/MissionLogger.ts';
import MissionDTO, { MissionRow } from '#src/app/dto/MissionDTO.ts';
import { dbClient } from '../../database/index.ts';
import { engineInstance } from '#src/main.ts';
import { MissionEntity } from '#src/app/models/mission.model.ts';

class GameService {

    private ee = new EventEmitter<{
        shouldUpdateSelectedTargetIds(): void;
        shouldUpdateMissileChannels(): void;
    }>();
    private radars: Radar[] = [];
    private weapons: Weapon[] = []
    private logger = new MissionLogger()

    public async startMission(missionId: number) {
        const mission = await dbClient.findOne<MissionEntity>('missions', { id: missionId });
        
		if (mission) {
			engineInstance.resetMission();
			engineInstance.startMission(mission.tasks);
			
            mission.environment.forEach(environment => console.log(environment))
		}
    }

    public getLogs() {
        return this.logger.getLogs()
    }
}

const gameService = new GameService()

export default gameService;