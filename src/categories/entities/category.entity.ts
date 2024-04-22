import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MemberGrade } from '../../members/member-grade.enum';

@Entity()
export class Category extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '카테고리 PK', type: 'number' })
  id: number;

  @Column({ comment: '카테고리 이름', type: 'varchar' })
  @ApiProperty({ description: '카테고리 이름', type: 'string' })
  name: string;

  @Column({ comment: '카테고리 우선순위', type: 'int' })
  @ApiProperty({ description: '카테고리 우선순위', type: 'number' })
  priority: number;

  @Column({ comment: '접근 가능한 회원 등급', type: 'simple-array', nullable: true })
  @ApiProperty({
    description: '접근 가능한 회원 등급',
    type: 'enum',
    enum: MemberGrade,
    isArray: true,
  })
  accessGrades: MemberGrade[];
}
