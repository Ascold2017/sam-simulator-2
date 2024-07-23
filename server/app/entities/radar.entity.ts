import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Environment } from "./environment.entity";

@Entity()
export class Radar extends BaseEntity {
  @Column()
  name: string;

  @Column()
  updateTime: number;

  @Column()
  maxDistance: number;

  @Column()
  maxCaptureRange: number;

  @Column()
  minCaptureRange: number;

  @Column()
  maxDetectCount: number;

  @Column({ type: 'double precision' })
  minElevation: number;

  @Column({ type: 'double precision' })
  maxElevation: number;
  
  @Column({ type: 'double precision' })
  radarHeight: number;

  @OneToOne(() => Environment, environment => environment.radar)
  environment: Environment;
}
