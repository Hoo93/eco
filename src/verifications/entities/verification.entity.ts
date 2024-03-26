import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Verification {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '인증내역 PK', type: 'number' })
  id: number;

  @Column({ comment: '휴대전화번호', type: 'varchar' })
  @ApiProperty({ description: '휴대전화번호', type: 'string' })
  mobileNumber: string;

  @Column({ comment: '인증코드', type: 'varchar' })
  @ApiProperty({ description: '인증코드', type: 'string' })
  code: string;

  @Column({ nullable: false, comment: '인증여부', type: 'boolean', default: false })
  @ApiProperty({ description: '인증여부', type: 'boolean' })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  public isEqual(code: string) {
    return this.code === code;
  }
}
