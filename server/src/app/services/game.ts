import { Radar } from '#src/core/Radar/index.ts';
import { Weapon } from '#src/core/Weapon/index.ts';
import EventEmitter from 'https://deno.land/x/eventemitter@1.2.4/mod.ts';
import MissionLogger from '#src/core/MissionLogger.ts';
import MissionDTO, { MissionRow } from '#src/app/dto/MissionDTO.ts';
import { dbClient } from '../../database/index.ts';
import { engineInstance } from '#src/main.ts';

class GameService {

    private ee = new EventEmitter<{
        shouldUpdateSelectedTargetIds(): void;
        shouldUpdateMissileChannels(): void;
    }>();
    private radars: Radar[] = [];
    private weapons: Weapon[] = []
    private logger = new MissionLogger()

    public async startMission(missionId: number) {
        const mission = await dbClient.findOne('missions', { missionId });
        /*
		if (mission) {
			engineInstance.resetMission();
			engineInstance.startMission(mission.tasks);
			
		}*/
    }

    public getLogs() {
        return this.logger.getLogs()
    }
}

const gameService = new GameService()

export default gameService;