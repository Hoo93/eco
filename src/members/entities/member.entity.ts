import { User } from '../../users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberType } from '../../auth/const/member-type.enum';

@Entity()
export class Member extends User {
  @PrimaryGeneratedColumn('uuid', { comment: '회원번호' })
  @ApiProperty({ description: '회원번호' })
  id: string;

  @Column({ comment: '회원 타입', type: 'varchar' })
  @ApiProperty({ description: '회원 이름', type: 'string' })
  type: MemberType;

  @Column({ nullable: true, comment: '생년월일', type: 'varchar' })
  @ApiPropertyOptional({ description: '생년월일', type: 'string' })
  birthday?: string;

  @Column({ nullable: true, comment: '이메일', type: 'varchar' })
  @ApiPropertyOptional({ description: '이메일', type: 'string' })
  email?: string;
}
