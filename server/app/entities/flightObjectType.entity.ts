import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class FlightObjectType extends BaseEntity {
  @Column()
  name: string;

  @Column()
  rcs: number;

  @Column()
  maxVelocity: number;
  
  @Column()
  altitude: number;
}
