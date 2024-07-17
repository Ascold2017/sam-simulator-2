import { Column, PrimaryGeneratedColumn } from "typeorm";


export abstract class BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000'  })
  createdAt!: number;
}
