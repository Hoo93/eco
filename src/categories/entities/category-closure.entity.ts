import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['ancestorId', 'descendantId'])
export class CategoryClosure {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '카테고리 클로저 PK', type: 'number' })
  id: number;

  @Column({ comment: '조상 카테고리 PK', type: 'integer' })
  @ApiProperty({ description: '조상 카테고리 PK', type: 'number' })
  ancestorId: number;

  @Column({ comment: '자손 카테고리 PK', type: 'integer' })
  @ApiProperty({ description: '자손 카테고리 PK', type: 'number' })
  descendantId: number;

  @Column({ comment: '카테고리 뎁스', type: 'integer', default: 0 })
  @ApiProperty({ description: '카테고리 뎁스', type: 'number', example: 0 })
  depth: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ancestorId' })
  ancestor: Category;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'descendantId' })
  descendant: Category;
}
