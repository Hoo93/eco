import { User } from '../../common/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberType } from '../../auth/const/member-type.enum';
import { LoginType } from '../../auth/const/login-type.enum';

@Entity()
@Unique(['email'])
@Unique(['username'])
@Unique(['mobileNumber'])
export class Member extends User {
  @PrimaryGeneratedColumn('uuid', { comment: '회원번호' })
  @ApiProperty({ description: '회원번호' })
  id: string;

  @Column({ comment: '회원 타입', type: 'varchar' })
  @ApiProperty({ description: '회원 이름', type: 'string' })
  type: MemberType;

  @Column({ comment: '로그인 타입', type: 'varchar', default: LoginType.LOCAL })
  @ApiProperty({ description: '로그인 타입', type: 'enum', enum: LoginType })
  loginType: LoginType;

  @Column({ comment: '회원 닉네임', type: 'varchar' })
  @ApiProperty({ description: '회원 닉네임', type: 'string' })
  nickname: string;

  @Column({ comment: '전화번호', type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: '전화번호', type: 'string' })
  mobileNumber: string;

  @Column({ nullable: true, comment: '이메일', type: 'varchar' })
  @ApiPropertyOptional({ description: '이메일', type: 'string' })
  email?: string;

  @Column({ nullable: true, comment: '생년', type: 'varchar' })
  @ApiPropertyOptional({ description: '생년', type: 'string' })
  birthYear?: string;

  @Column({ nullable: true, comment: '생년월일', type: 'varchar' })
  @ApiPropertyOptional({ description: '생년월일', type: 'string' })
  birthday?: string;

  @Column({ comment: '자동로그인 여부', type: 'boolean', nullable: false, default: false })
  @ApiPropertyOptional({ description: '자동로그인 여부', type: 'boolean', default: false })
  isAutoLogin?: boolean;
}
