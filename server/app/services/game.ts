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
import { Mission } from "../entities/mission.entity";
import { MissionDTO } from "../dto/mission.dto";

class GameService {
    private currentMission: Mission | null = null;
    private radars: GameRadar[] = [];
    private weapons: GameWeapon[] = [];
    private logger: MissionLogger | null = null;
    private eventBus = new TypedEventEmitter<EventsMap>();

    public async launchMission(missionId: number) {
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
            this.currentMission = mission;
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
            this.logger = new MissionLogger();
            return true;
        }
    }

    public getCurrentMission() {
        if (!this.currentMission) return null;
        return {
            mission: new MissionDTO(this.currentMission),
            radars: this.currentMission.environments.filter((env) => env.type === "radar").map(
                (env) => new EnvironmentRadarResponseDTO(env)
            ),
            sams: this.currentMission.environments.filter((env) => env.type === "sam").map(
                (env) => new EnvironmentSAMResponseDTO(env)
            ),
        };
    }

    public getLogs() {
        return this.logger?.getLogs();
    }

    public stopMission() {
        engineInstance.resetMission();
        this.radars = [];
        this.weapons = [];
        this.currentMission = null;
        this.logger = null;
    }

    public setIsEnabledRadar(radarId: number, value: boolean) {
        this.radars.find((r) => r.id === radarId)?.entity.setIsEnabled(value);
    }

    private initMissionRadars(environments: Environment[]) {
        environments.forEach((env) => {
            const radarEntity = new Radar(
                new EnvironmentRadarConstructorDTO(
                    engineInstance,
                    this.logger!,
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
                    this.logger!,
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
                    this.logger!,
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
        this.eventBus.off('radarUpdate', cb)
    }
}

const gameService = new GameService();

export default gameService;
