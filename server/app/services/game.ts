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
import { EventsMap } from "../types/game-service";
import { RadarObjectDTO } from "../dto/radarObject.dto";
import { Mission } from "../entities/mission.entity";
import { MissionDTO } from "../dto/mission.dto";
import { RadarEnabledResponse, RadarUpdateResponse } from "@shared/models/game.model";
import _ from "lodash";

class GameService {
    private currentMission: Mission | null = null;
    private radars: Radar[] = [];
    private weapons: Weapon[] = [];
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

        this.currentMission = mission;
        this.logger = new MissionLogger();
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

        return true;
    }

    public getCurrentMission() {
        if (!this.currentMission) return null;
        return {
            mission: new MissionDTO(this.currentMission),
            radars: this.currentMission.environments.filter((env) =>
                env.type === "radar"
            ).map(
                (env) => {
                    const radar = this.radars.find((r) =>
                        r.entityId === env.id
                    );
                    return new EnvironmentRadarResponseDTO(env, radar);
                },
            ),
            sams: this.currentMission.environments.filter((env) =>
                env.type === "sam"
            ).map(
                (env) => {
                    const radar = this.radars.find((r) =>
                        r.entityId === env.id
                    );
                    const weapon = this.weapons.find((w) =>
                        w.entityId === env.id
                    );
                    return new EnvironmentSAMResponseDTO(
                        env,
                        radar,
                        weapon,
                    );
                },
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

    public setIsEnabledRadar(radarGameId: string, value: boolean) {
        this.radars.find((r) => r.id === radarGameId)?.setIsEnabled(value);
        this.eventBus.emit('radarEnabled', {
            radarId: radarGameId,
            radarEnabled: value
        })
    }

    public onRadarUpdate(cb: (payload: RadarUpdateResponse) => void) {
        this.eventBus.on("radarUpdate", cb);
    }

    public onRadarEnabled(cb: (payload: RadarEnabledResponse) => void) {
        this.eventBus.on('radarEnabled', cb)
    }

    public offRadarUpdate(cb: (payload: RadarUpdateResponse) => void) {
        this.eventBus.off("radarUpdate", cb);
    }

    public offRadarEnabled(cb: (payload: RadarEnabledResponse) => void) {
        this.eventBus.off("radarEnabled", cb);
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

            radarEntity.addUpdateListener(env.name, (radarObjects, cursorAngle) => this.eventBus.emit("radarUpdate", {
                radarId: radarEntity.id,
                radarObjects: radarObjects.map((ro) =>
                    new RadarObjectDTO(ro)
                ),
                cursorAngle
            }));
            this.radars.push(radarEntity);
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
            radarEntity.addUpdateListener(env.name, (radarObjects, cursorAngle) => this.eventBus.emit("radarUpdate", {
                radarId: radarEntity.id,
                radarObjects: radarObjects.map((ro) =>
                    new RadarObjectDTO(ro)
                ),
                cursorAngle
            }));

            this.radars.push(radarEntity);

            const weaponEntity = new Weapon(
                new EnvironmentWeaponConstructorDTO(
                    engineInstance,
                    this.logger!,
                    env,
                    radarEntity,
                ),
            );

            this.weapons.push(weaponEntity);
        });
    }
}

const gameService = new GameService();

export default gameService;
