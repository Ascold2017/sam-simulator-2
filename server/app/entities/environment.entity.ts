import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Mission } from "./mission.entity";
import { Radar } from "./radar.entity";
import { SAM } from "./sam.entity";

@Entity()
export class Environment extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: 'radar' | 'sam';

  @Column('jsonb')
  position: { x: number; y: number; z: number };

  @ManyToOne(() => Mission, mission => mission.environments)
  mission: Mission;

  @OneToOne(() => Radar, radar => radar.environment, { nullable: true })
  radar: Radar;

  @OneToOne(() => SAM, sam => sam.environment, { nullable: true })
  sam: SAM;
}
