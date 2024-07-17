import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Mission } from "./mission.entity";
import { BaseEntity } from "./base.entity";
import { FlightObjectType } from "./flightObjectType.entity";

@Entity()
export class MissionFlightTask extends BaseEntity {
  @Column()
  name: string;

  @Column()
  delay: number;

  @Column('jsonb')
  points: { x: number; y: number; z: number; v: number }[];

  @ManyToOne(() => Mission, mission => mission.tasks)
  mission: Mission;

  @ManyToOne(() => FlightObjectType)
  flightObjectType: FlightObjectType;
 
}