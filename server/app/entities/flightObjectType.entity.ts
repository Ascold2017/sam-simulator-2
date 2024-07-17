import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class FlightObjectType extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'double precision' })
  rcs: number;

  @Column({ type: 'double precision' })
  maxVelocity: number;
  
  @Column({ type: 'double precision' })
  altitude: number;
}
