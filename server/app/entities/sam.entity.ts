import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Environment } from "./environment.entity";
import { Radar } from "./radar.entity";

@Entity()
export class SAM extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: 'missile' | 'gun';

  @Column()
  weaponMaxSelectedCount: number;

  @Column()
  weaponChannelsCount: number;

  @Column()
  weaponAmmoCount: number;

  @Column()
  weaponVelocity: number;

  @Column()
  weaponMaxDistance: number;

  @Column({ type: 'double precision' })
  ammoKillRadius: number;

  @Column({ type: 'double precision' })
  ammoMaxDeltaRotation: number;

  @OneToOne(() => Radar, radar => radar.sam)
  radar: Radar;

  @OneToOne(() => Environment, environment => environment.sam)
  environment: Environment;
}
