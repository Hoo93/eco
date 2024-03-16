import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MemberLoginHistory {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '로그인 이력 PK', type: 'string' })
  id: number;

  @Column({ comment: '회원 PK', type: 'varchar' })
  @ApiProperty({ description: '회원 PK', type: 'string' })
  memberId: string;

  @Column({ comment: '로그인 ip', type: 'varchar' })
  @ApiProperty({ description: '로그인 ip', type: 'string' })
  currentIp: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
