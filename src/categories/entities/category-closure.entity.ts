import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CategoryClosure {
  @Column({ comment: '조상 카테고리 PK', type: 'integer' })
  @ApiProperty({ description: '조상 카테고리 PK', type: 'number' })
  ancestorId: number;

  @Column({ comment: '자손 카테고리 PK', type: 'integer' })
  @ApiProperty({ description: '자손 카테고리 PK', type: 'number' })
  descendantId: number;

  @Column({ comment: '카테고리 뎁스', type: 'integer', default: 0 })
  @ApiProperty({ description: '카테고리 뎁스', type: 'number', example: 0 })
  depth: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'ancestorId' })
  ancestor: Category;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'descendantId' })
  descendant: Category;
}
