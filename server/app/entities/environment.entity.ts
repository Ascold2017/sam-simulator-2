import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Mission } from "./mission.entity";
import { Radar } from "./radar.entity";
import { Weapon } from "./weapon.entity";

@Entity()
export class Environment extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: "radar" | "sam";

  @Column("jsonb")
  position: { x: number; y: number; z: number };

  @ManyToOne(() => Mission, (mission) => mission.environments)
  mission: Mission;

  @ManyToOne(() => Radar, { nullable: true })
  radar: Radar;

  @ManyToOne(() => Weapon, { nullable: true })
  weapon: Weapon;
}
