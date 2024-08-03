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
import _ from "lodash";
import { TargetObjectDTO } from "../dto/targetObject.dto";

class GameService {
    private currentMission: Mission | null = null;
    private radars: Radar[] = [];
    private weapons: Weapon[] = [];
    private logger: MissionLogger | null = null;
    public readonly eventBus = new TypedEventEmitter<EventsMap>();

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

            radarEntity.setUpdateListener((data) =>
                this.eventBus.emit("radarUpdate", {
                    radarId: radarEntity.id,
                    radarObjects: data.radarObjects.map((ro) =>
                        new RadarObjectDTO(ro)
                    ),
                    cursorAngle: data.cursorAngle,
                    enabled: data.enabled,
                })
            );
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
            radarEntity.setUpdateListener((data) =>
                this.eventBus.emit("radarUpdate", {
                    radarId: radarEntity.id,
                    radarObjects: data.radarObjects.map((ro) =>
                        new RadarObjectDTO(ro)
                    ),
                    cursorAngle: data.cursorAngle,
                    enabled: data.enabled,
                })
            );

            this.radars.push(radarEntity);

            const weaponEntity = new Weapon(
                new EnvironmentWeaponConstructorDTO(
                    engineInstance,
                    this.logger!,
                    env,
                    radarEntity,
                ),
            );

            weaponEntity.addListener((data) => {
                this.eventBus.emit("weaponUpdate", {
                    weaponId: weaponEntity.id,
                    cursorAzimuth: data.cursorAzimuth,
                    cursorElevation: data.cursorElevation,
                    capturedTargetId: data.capturedTargetId,
                    targetObjects: data.targetObjects.map(to => new TargetObjectDTO(to)),
                    ammoLeft: data.ammoLeft,
                });
            });

            this.weapons.push(weaponEntity);
        });
    }

    public moveCursor(
        weaponGameId: string,
        azimuth: number,
        elevation: number,
    ) {
        const weapon = this.weapons.find((w) => w.id === weaponGameId);
        if (!weapon || (weapon && !!weapon.selectedTarget)) return;
        weapon.moveCursor(azimuth, elevation);
    }

    public captureTarget(
        weaponGameId: string,
    ) {
        this.weapons.find((w) => w.id === weaponGameId)
            ?.captureTarget();
    }

    public resetTarget(
        weaponGameId: string,
    ) {
        this.weapons.find((w) => w.id === weaponGameId)?.unselectTarget();
    }

    public fire(weaponGameId: string, method: "3P" | "1/2") {
        this.weapons.find((w) => w.id === weaponGameId)
            ?.launchWeapon(method);
    }
}

const gameService = new GameService();

export default gameService;
