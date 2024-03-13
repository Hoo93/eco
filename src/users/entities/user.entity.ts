import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseTimeEntity } from '../../BaseTimeEntity';
import * as bcrypt from 'bcrypt';
import { SALT } from '../../auth/const/auth.const';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
@Unique(['mobileNumber'])
@Unique(['username'])
@Unique(['email'])
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '회원번호' })
  @ApiProperty({ description: '회원번호' })
  id: string;

  @Column({ comment: '회원 아이디', type: 'varchar' })
  @ApiProperty({ description: '회원 아이디', type: 'string' })
  username: string;

  @Column({ comment: '회원 비밀번호', type: 'varchar' })
  @ApiProperty({ description: '회원 비밀번호', type: 'string' })
  password: string;

  @Column({ comment: '회원 이름', type: 'varchar' })
  @ApiProperty({ description: '회원 이름', type: 'string' })
  name: string;

  @Column({ comment: '회원 전화번호', type: 'varchar' })
  @ApiProperty({ description: '회원 전화번호', type: 'string' })
  mobileNumber: string;

  @Column({ nullable: true, comment: '회원 생년월일', type: 'varchar' })
  @ApiPropertyOptional({ description: '회원 생년월일', type: 'string' })
  birthday?: string;

  @Column({ nullable: true, comment: '회원 이메일', type: 'varchar' })
  @ApiPropertyOptional({ description: '회원 이메일', type: 'string' })
  email?: string;

  @Column({ nullable: true, comment: '리프레시토큰', type: 'varchar' })
  @ApiPropertyOptional({ description: '리프레시토큰', type: 'string' })
  refreshToken?: string;

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, SALT);
  }
}
