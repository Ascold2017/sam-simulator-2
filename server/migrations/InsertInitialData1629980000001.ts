import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';
import { Environment } from '../app/entities/environment.entity';
import { FlightObjectType } from '../app/entities/flightObjectType.entity';
import { MissionFlightTask } from '../app/entities/flightTask.entity';
import { Mission } from '../app/entities/mission.entity';
import { Radar } from '../app/entities/radar.entity';
import { SAM } from '../app/entities/sam.entity';

export class InsertInitialData1629980000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.insertDataFromJson(queryRunner, 'mission.json', Mission);
    await this.insertDataFromJson(queryRunner, 'radar.json', Radar);
    await this.insertDataFromJson(queryRunner, 'sam.json', SAM);
    await this.insertDataFromJson(queryRunner, 'flight_object_type.json', FlightObjectType);
    await this.insertDataFromJson(queryRunner, 'environment.json', Environment);
    await this.insertDataFromJson(queryRunner, 'mission_flight_task.json', MissionFlightTask);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Implement down migration if needed
  }

  private async insertDataFromJson(queryRunner: QueryRunner, filename: string, entityClass: any): Promise<void> {
    const filePath = `${__dirname}/data/${filename}`;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const record of data) {
      const createdEntity = queryRunner.manager.create(entityClass, record);
      await queryRunner.manager.save(createdEntity);
    }
  }
}
