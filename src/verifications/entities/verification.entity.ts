import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../members/entities/member.entity';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';

@Entity()
export class Verification extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '인증내역 PK', type: 'number' })
  id: number;

  @Column({ comment: '휴대전화번호', type: 'varchar' })
  @ApiProperty({ description: '휴대전화번호', type: 'string' })
  mobileNumber: string;

  @Column({ comment: '인증코드', type: 'varchar' })
  @ApiProperty({ description: '인증코드', type: 'string' })
  code: string;

  @Column({ comment: '인증여부', type: 'boolean' })
  @ApiProperty({ description: '인증여부', type: 'boolean' })
  isVerified: boolean;
}
