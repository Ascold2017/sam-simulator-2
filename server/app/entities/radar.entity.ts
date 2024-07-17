import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Environment } from "./environment.entity";

@Entity()
export class Radar extends BaseEntity {
  @Column()
  name: string;

  @Column()
  maxDistance: number;

  @Column()
  maxCaptureRange: number;

  @Column()
  minCaptureRange: number;

  @Column()
  maxDetectCount: number;

  @Column()
  minElevation: number;

  @Column()
  maxElevation: number;
  
  @Column()
  radarHeight: number;

  @OneToMany(() => Environment, environment => environment.radar)
  environments: Environment[];
}
