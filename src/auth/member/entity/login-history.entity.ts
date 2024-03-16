import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../../members/entities/member.entity';

@Entity()
export class MemberLoginHistory {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '로그인 이력 PK', type: 'number' })
  id: number;

  @Column({ comment: '회원 PK', type: 'varchar' })
  @ApiProperty({ description: '회원 PK', type: 'string' })
  memberId: string;

  @Column({ comment: '로그인 ip', type: 'varchar' })
  @ApiProperty({ description: '로그인 ip', type: 'string' })
  currentIp: string;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({ description: '로그인 시간', example: '2021-01-01T00:00:00.000Z' })
  loginAt: Date;

  // 단방향 관계로 설정
  @ManyToOne(() => Member)
  @JoinColumn({ name: 'memberId' })
  member: Member;
}
