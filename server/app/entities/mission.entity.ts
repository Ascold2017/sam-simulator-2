import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Environment } from "./environment.entity";
import { MissionFlightTask } from "./flightTask.entity";
import { BaseEntity } from "./base.entity";

@Entity()
export class Mission extends BaseEntity {
  @Column()
  name: string;

  @Column('text', { nullable: true })
  map256?: string;

  @Column('text', { nullable: true })
  map1024?: string;

  @OneToMany(() => Environment, environment => environment.mission)
  environments: Environment[];

  @OneToMany(() => MissionFlightTask, task => task.mission)
  tasks: MissionFlightTask[];
}
