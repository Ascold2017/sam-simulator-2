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
  ammoCount: number;

  @Column()
  ammoVelocity: number;

  @Column()
  weaponMaxDistance: number;

  @Column({ type: 'double precision' })
  ammoKillRadius: number;

  @Column({ type: 'double precision' })
  ammoMaxDeltaRotation: number;

  @OneToOne(() => Environment, environment => environment.weapon)
  environment: Environment;
}
