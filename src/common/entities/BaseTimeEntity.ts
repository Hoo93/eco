import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseTimeEntity {
  @Column({ select: false })
  createId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, select: false })
  updateId: string;

  @UpdateDateColumn({ nullable: true, select: false })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;
}
