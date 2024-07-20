import { QueryRunner } from "typeorm";
import { DI } from "../config/dataSource";
import { MissionDTO } from "../dto/mission.dto";
import { Environment } from "../entities/environment.entity";
import { MissionFlightTask } from "../entities/flightTask.entity";
import { Mission } from "../entities/mission.entity";
import { CreateMissionPayload } from "../types/mission-service";

export class MissionService {
    async getMissions() {
        const missions = await DI.mission.find();

        return missions.map((m) => new MissionDTO(m));
    }

    async createMission(missionData: CreateMissionPayload) {
        const queryRunner = DI.ads.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const missionRepository = queryRunner.manager.getRepository(
                Mission,
            );
            const environmentRepository = queryRunner.manager.getRepository(
                Environment,
            );
            const missionFlightTaskRepository = queryRunner.manager
                .getRepository(MissionFlightTask);

            const mission = missionRepository.create({
                name: missionData.name,
            });
            await missionRepository.save(mission);

            const createdEnvironments = await this.createEnvironments(
                missionData.environments,
                mission,
                queryRunner,
            );
            const createdTasks = await this.createTasks(
                missionData.tasks,
                mission,
                queryRunner,
            );

            mission.environments = createdEnvironments;
            mission.tasks = createdTasks;

            await environmentRepository.save(createdEnvironments);
            await missionFlightTaskRepository.save(createdTasks);

            await queryRunner.commitTransaction();

            return new MissionDTO(mission);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create mission: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async updateMission(missionId: number, missionData: CreateMissionPayload) {
        const queryRunner = DI.ads.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const missionRepository = queryRunner.manager.getRepository(
                Mission,
            );
            const environmentRepository = queryRunner.manager.getRepository(
                Environment,
            );
            const missionFlightTaskRepository = queryRunner.manager
                .getRepository(MissionFlightTask);

            const mission = await missionRepository.findOne({
                where: { id: missionId },
                relations: ["environments", "tasks"],
            });
            if (!mission) {
                throw new Error(`Mission with id ${missionId} not found`);
            }

            mission.name = missionData.name;

            await environmentRepository.remove(mission.environments);
            await missionFlightTaskRepository.remove(mission.tasks);

            const updatedEnvironments = await this.createEnvironments(
                missionData.environments,
                mission,
                queryRunner,
            );
            const updatedTasks = await this.createTasks(
                missionData.tasks,
                mission,
                queryRunner,
            );

            mission.environments = updatedEnvironments;
            mission.tasks = updatedTasks;

            await missionRepository.save(mission);
            await queryRunner.commitTransaction();

            return new MissionDTO(mission);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to update mission: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    private async createEnvironments(
        environments: CreateMissionPayload["environments"],
        mission: Mission,
        queryRunner: QueryRunner,
    ) {
        const environmentRepository = queryRunner.manager.getRepository(
            Environment,
        );

        return await Promise.all(
            environments.map(async (envData) => {
                const environment = environmentRepository.create(envData);
                if (envData.radarId) {
                    const radar = await DI.radar.findOne({
                        where: { id: envData.radarId },
                    });
                    if (radar) environment.radar = radar;
                }
                if (envData.weaponId) {
                    const weapon = await DI.weapon.findOne({
                        where: { id: envData.weaponId },
                    });
                    if (weapon) environment.weapon = weapon;
                }
                environment.mission = mission;
                return environment;
            }),
        );
    }

    private async createTasks(
        tasks: CreateMissionPayload["tasks"],
        mission: Mission,
        queryRunner: QueryRunner,
    ) {
        const missionFlightTaskRepository = queryRunner.manager.getRepository(
            MissionFlightTask,
        );

        return await Promise.all(
            tasks.map(async (taskData) => {
                const flightObjectType = await DI.flightObjectType.findOne({
                    where: { id: taskData.flightObjectTypeId },
                });
                if (!flightObjectType) {
                    throw new Error(
                        `FlightObjectType with id ${taskData.flightObjectTypeId} not found`,
                    );
                }
                const task = missionFlightTaskRepository.create({
                    ...taskData,
                    flightObjectType,
                    mission,
                });
                return task;
            }),
        );
    }

    async deleteMission(missionId: number) {
        const queryRunner = DI.ads.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const missionRepository = queryRunner.manager.getRepository(
                Mission,
            );
            const environmentRepository = queryRunner.manager.getRepository(
                Environment,
            );
            const missionFlightTaskRepository = queryRunner.manager
                .getRepository(MissionFlightTask);

            const mission = await missionRepository.findOne({
                where: { id: missionId },
                relations: ["environments", "tasks"],
            });
            if (!mission) {
                throw new Error(`Mission with id ${missionId} not found`);
            }

            await environmentRepository.remove(mission.environments);
            await missionFlightTaskRepository.remove(mission.tasks);
            await missionRepository.remove(mission);

            await queryRunner.commitTransaction();

            return true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to delete mission: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
}

export const missionService = new MissionService();
