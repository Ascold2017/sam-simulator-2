import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Environment } from "./environment.entity";

@Entity()
export class Weapon extends BaseEntity {
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

  @OneToOne(() => Environment, environment => environment.weapon)
  environment: Environment;
}
