import { Column, PrimaryGeneratedColumn } from "typeorm";


export abstract class BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint' })
  createdAt = new Date().getTime();
}
