import {
    EnvironmentRadarConstructorDTO,
    EnvironmentRadarResponseDTO,
    EnvironmentSAMResponseDTO,
    EnvironmentWeaponConstructorDTO,
} from "../dto/environment.dto";
import { MissionTaskDTO } from "../dto/missionTask.dto";
import { DI } from "../config/dataSource";
import { engineInstance } from "../main";
import { Environment } from "../entities/environment.entity";
import { MissionLogger, Radar, Weapon } from "../../core";
import { TypedEventEmitter } from "../helpers/TypedEventEmitter";
import {
    EventsMap,
    GameRadar,
    GameWeapon,
    RadarUpdatePayload,
} from "../types/game-service";
import { RadarObjectDTO } from "../dto/radarObject.dto";

class GameService {
    private environments: Environment[] = [];
    private radars: GameRadar[] = [];
    private weapons: GameWeapon[] = [];
    private logger = new MissionLogger();
    private eventBus = new TypedEventEmitter<EventsMap>();

    public async loadMission(missionId: number) {
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

            this.initMissionRadars(
                mission.environments.filter((env) => env.type === "radar"),
            );
            this.initMissionSAMs(
                mission.environments.filter((env) => env.type === "sam"),
            );
            this.environments = mission.environments;
        }
    }

    public getEnvironments() {
        return {
            radars: this.environments.filter((env) => env.type === "radar").map(
                (env) => new EnvironmentRadarResponseDTO(env)
            ),
            sams: this.environments.filter((env) => env.type === "sam").map(
                (env) => new EnvironmentSAMResponseDTO(env)
            ),
        };
    }

    public getLogs() {
        return this.logger.getLogs();
    }

    public stopMission() {
        engineInstance.resetMission();
        this.radars = [];
        this.weapons = [];
        this.environments = [];
        this.logger = new MissionLogger();
    }

    public setIsEnabledRadar(radarId: number, value: boolean) {
        this.radars.find((r) => r.id === radarId).entity.setIsEnabled(value);
    }

    private initMissionRadars(environments: Environment[]) {
        environments.forEach((env) => {
            const radarEntity = new Radar(
                new EnvironmentRadarConstructorDTO(
                    engineInstance,
                    this.logger,
                    env,
                ),
            );
            radarEntity.addUpdateListener(env.name, (radarObjects) => {
                this.eventBus.emit("radarUpdate", {
                    radarId: env.id,
                    radarName: radarEntity.name,
                    radarObjects: radarObjects.map(ro => new RadarObjectDTO(ro)),
                });
            });
            this.radars.push({
                id: env.id,
                entity: radarEntity,
            });
        });
    }

    private initMissionSAMs(environments: Environment[]) {
        environments.forEach((env) => {
            const radarEntity = new Radar(
                new EnvironmentRadarConstructorDTO(
                    engineInstance,
                    this.logger,
                    env,
                ),
            );
            radarEntity.addUpdateListener(env.name, (radarObjects) => {
                this.eventBus.emit("radarUpdate", {
                    radarId: env.id,
                    radarName: radarEntity.name,
                    radarObjects: radarObjects.map(ro => new RadarObjectDTO(ro)),
                });
            });

            this.radars.push({
                id: env.id,
                entity: radarEntity,
            });

            const weaponEntity = new Weapon(
                new EnvironmentWeaponConstructorDTO(
                    engineInstance,
                    this.logger,
                    env,
                    radarEntity,
                ),
            );

            this.weapons.push({
                id: env.id,
                entity: weaponEntity,
            });
        });
    }

    public onRadarUpdate(cb: (payload: RadarUpdatePayload) => void) {
        this.eventBus.on("radarUpdate", cb);
    }

    public offRadarUpdate(cb: (payload: RadarUpdatePayload) => void) {
        this.eventBus.off('radrUpdate', cb)
    }
}

const gameService = new GameService();

export default gameService;
