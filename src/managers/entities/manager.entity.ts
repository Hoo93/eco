import { User } from '../../common/entities/user.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Manager extends User {
  @PrimaryGeneratedColumn('uuid', { comment: '어드민 번호' })
  @ApiProperty({ description: '어드민 번호' })
  id: string;
}
