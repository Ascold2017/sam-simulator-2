import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { BaseEntity } from '../entities/base.entity';
import { Mission } from '../entities/mission.entity';
import { Environment } from '../entities/environment.entity';
import { FlightObjectType } from '../entities/flightObjectType.entity';
import { MissionFlightTask } from '../entities/flightTask.entity';
import { Radar } from '../entities/radar.entity';
import { Weapon } from '../entities/weapon.entity';

dotenv.config()

export const AppDataSource = new DataSource({
    url: process.env.DB_URI,
    type: "postgres",
    logging: true,
    entities: [BaseEntity, Mission, Environment, Radar, FlightObjectType, MissionFlightTask, Weapon],
    migrations: ['./migrations/*.ts'],
    migrationsTableName: "migration",
    synchronize: true,
    ssl: false,
});


export const DI = {
    em: AppDataSource.manager,
    mission: AppDataSource.getRepository(Mission),
    environment: AppDataSource.getRepository(Environment),
    radar: AppDataSource.getRepository(Radar),
    flightObjectType: AppDataSource.getRepository(FlightObjectType),
    missionFlightTask: AppDataSource.getRepository(MissionFlightTask),
    weapon: AppDataSource.getRepository(Weapon)
};