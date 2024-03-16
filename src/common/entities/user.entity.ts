import { Column } from 'typeorm';
import { BaseTimeEntity } from './BaseTimeEntity';
import * as bcrypt from 'bcrypt';
import { SALT } from '../../auth/const/auth.const';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class User extends BaseTimeEntity {
  @Column({ comment: '회원 아이디', type: 'varchar' })
  @ApiProperty({ description: '회원 아이디', type: 'string' })
  username: string;

  @Column({ comment: '회원 비밀번호', type: 'varchar' })
  @ApiProperty({ description: '회원 비밀번호', type: 'string' })
  password: string;

  @Column({ comment: '회원 이름', type: 'varchar' })
  @ApiProperty({ description: '회원 이름', type: 'string' })
  name: string;

  @Column({ nullable: true, comment: '리프레시토큰', type: 'varchar' })
  @ApiPropertyOptional({ description: '리프레시토큰', type: 'string' })
  refreshToken?: string;

  @Column({ comment: '최근 로그인 일자', type: 'datetime', nullable: true })
  @ApiPropertyOptional({ description: '최근 로그인 일자', type: 'datetime' })
  latestLoginDate: Date;

  @Column({ comment: '최근 로그인 IP', type: 'varchar', nullable: false })
  @ApiPropertyOptional({ description: '최근 로그인 IP', type: 'string' })
  loginIp: string;

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, SALT);
  }
}
