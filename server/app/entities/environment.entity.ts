import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
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

  @ManyToOne(() => Radar, radar => radar.environments, { nullable: true })
  radar: Radar;

  @ManyToOne(() => SAM, sam => sam.environments, { nullable: true })
  sam: SAM;

  @Column('jsonb')
  position: { x: number; y: number; z: number };

  @ManyToOne(() => Mission, mission => mission.environments)
  mission: Mission;
}
