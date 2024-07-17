import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Environment } from "./environment.entity";

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

  @Column()
  ammoKillRadius: number;

  @Column()
  ammoMaxDeltaRotation: number;

  @OneToMany(() => Environment, environment => environment.sam)
  environments: Environment[];
}
