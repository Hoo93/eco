import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '카테고리 PK', type: 'number' })
  id: number;

  @Column({ comment: '카테고리 이름', type: 'varchar' })
  @ApiProperty({ description: '카테고리 이름', type: 'string' })
  name: string;
}
